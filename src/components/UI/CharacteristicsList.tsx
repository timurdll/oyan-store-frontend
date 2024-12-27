import styles from "@styles/product-page.module.scss";
import { ProductCharacteristic } from "types/types";

const CharacteristicsList: React.FC<{
  characteristicsToShow: ProductCharacteristic[];
  showAllCharacteristics: boolean;
  setShowAllCharacteristics: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  characteristicsToShow,
  showAllCharacteristics,
  setShowAllCharacteristics,
}) => (
  <div className={styles.characteristics}>
    {characteristicsToShow.map((char) => (
      <div className={styles.characteristic} key={char.id}>
        <span className={styles.name}>{char.characteristic.name}:</span>
        <span className={styles.description}>{char.description}</span>
      </div>
    ))}
    <button
      onClick={() => setShowAllCharacteristics(!showAllCharacteristics)}
      className={styles.showMoreBtn}
    >
      {showAllCharacteristics ? "Скрыть" : "Показать все"}
    </button>
  </div>
);

export default CharacteristicsList;
