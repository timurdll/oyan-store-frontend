import React, { useMemo, useState } from "react";
import styles from "@styles/admin-panel.module.scss";
import {
  useCreateTelegramBotMutation,
  useDeleteTelegramBotMutation,
  useFetchTelegramBotsQuery,
  useUpdateTelegramBotMutation,
  TelegramBot,
} from "@redux/services/telegramBotsApi";

interface BotFormState {
  name: string;
  token: string;
  chatId: string;
  isActive: boolean;
}

const initialFormState: BotFormState = {
  name: "",
  token: "",
  chatId: "",
  isActive: true,
};

const TelegramBotsManager: React.FC = () => {
  const { data: bots, isLoading, isFetching, refetch } =
    useFetchTelegramBotsQuery();
  const [createBot, { isLoading: isCreating }] =
    useCreateTelegramBotMutation();
  const [updateBot, { isLoading: isUpdating }] =
    useUpdateTelegramBotMutation();
  const [deleteBot, { isLoading: isDeleting }] =
    useDeleteTelegramBotMutation();

  const [formState, setFormState] = useState<BotFormState>(initialFormState);
  const [editingBotId, setEditingBotId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(
    () =>
      !formState.name.trim() ||
      !formState.token.trim() ||
      !formState.chatId.trim() ||
      isCreating ||
      isUpdating,
    [formState, isCreating, isUpdating]
  );

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingBotId(null);
    setErrorMessage(null);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (bot: TelegramBot) => {
    setEditingBotId(bot.id);
    setFormState({
      name: bot.name,
      token: bot.token,
      chatId: bot.chatId,
      isActive: bot.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      if (editingBotId) {
        await updateBot({ id: editingBotId, data: formState }).unwrap();
      } else {
        await createBot(formState).unwrap();
      }

      resetForm();
      await refetch();
    } catch (error) {
      console.error("Ошибка при сохранении телеграм-бота:", error);
      setErrorMessage(
        "Не удалось сохранить данные бота. Проверьте корректность токена/чат ID и попробуйте снова."
      );
    }
  };

  const handleDelete = async (botId: number) => {
    if (!window.confirm("Удалить этого Telegram-бота?")) return;

    setErrorMessage(null);
    try {
      await deleteBot(botId).unwrap();
      if (editingBotId === botId) {
        resetForm();
      }
      await refetch();
    } catch (error) {
      console.error("Ошибка при удалении телеграм-бота:", error);
      setErrorMessage(
        "Не удалось удалить бота. Попробуйте повторить попытку."
      );
    }
  };

  const handleToggleActive = async (bot: TelegramBot) => {
    try {
      await updateBot({
        id: bot.id,
        data: { isActive: !bot.isActive },
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error("Ошибка при обновлении статуса бота:", error);
      setErrorMessage(
        "Не удалось обновить статус. Попробуйте повторить попытку."
      );
    }
  };

  return (
    <div className={styles.telegramBotsManager}>
      <h2>Telegram-боты для уведомлений</h2>
      <p className={styles.sectionDescription}>
        Здесь вы можете добавить или редактировать Telegram-ботов, которые
        будут получать уведомления о новых заказах и предзаказах. Добавьте
        токен бота, созданного через BotFather, и chat ID канала/чата, куда
        должны приходить уведомления.
      </p>

      <form className={styles.botForm} onSubmit={handleSubmit}>
        <h3>{editingBotId ? "Редактирование бота" : "Добавление нового бота"}</h3>
        <div className={styles.formGroup}>
          <label htmlFor="bot-name">Название</label>
          <input
            id="bot-name"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Например: Основной бот"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bot-token">Bot Token</label>
          <input
            id="bot-token"
            name="token"
            type="text"
            value={formState.token}
            onChange={handleInputChange}
            placeholder="1234567890:ABCDEF..."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bot-chat-id">Chat ID</label>
          <input
            id="bot-chat-id"
            name="chatId"
            type="text"
            value={formState.chatId}
            onChange={handleInputChange}
            placeholder="-1001234567890"
            required
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label htmlFor="bot-is-active">
            <input
              id="bot-is-active"
              name="isActive"
              type="checkbox"
              checked={formState.isActive}
              onChange={handleInputChange}
            />
            Активный бот (будут отправляться уведомления)
          </label>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitDisabled}
          >
            {editingBotId ? "Сохранить изменения" : "Добавить бота"}
          </button>
          {editingBotId && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={resetForm}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className={styles.botsList}>
        <div className={styles.listHeader}>
          <h3>Подключённые боты</h3>
          {(isLoading || isFetching || isCreating || isUpdating || isDeleting) && (
            <span className={styles.statusLabel}>Обновление...</span>
          )}
        </div>

        {bots && bots.length === 0 && (
          <p className={styles.emptyState}>
            Боты ещё не добавлены. Заполните форму выше, чтобы подключить
            первый Telegram-бот для уведомлений.
          </p>
        )}

        <ul>
          {bots?.map((bot) => (
            <li key={bot.id} className={styles.botItem}>
              <div className={styles.botInfo}>
                <div>
                  <h4>{bot.name}</h4>
                  <p>
                    <strong>Chat ID:</strong> {bot.chatId}
                  </p>
                  <p>
                    <strong>Статус:</strong>{" "}
                    {bot.isActive ? "Активен" : "Отключён"}
                  </p>
                </div>
              </div>
              <div className={styles.botActions}>
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => handleEdit(bot)}
                >
                  Изменить
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => handleToggleActive(bot)}
                >
                  {bot.isActive ? "Отключить" : "Включить"}
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(bot.id)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TelegramBotsManager;

