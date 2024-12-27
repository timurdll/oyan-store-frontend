export const smoothScroll = (targetY: number, duration: number) => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easeInOutQuad =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2; // плавная интерполяция
    const scrollY = startY + distance * easeInOutQuad;

    window.scrollTo(0, scrollY);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};
