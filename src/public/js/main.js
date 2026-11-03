/**
 * The Balanced Bowl - Client Interaction Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // Auto-dismiss alert / flash messages
  const flashMsgs = document.querySelectorAll('.flash, .alert');
  flashMsgs.forEach(msg => {
    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(-10px)';
      msg.style.transition = 'all 0.4s ease';
      setTimeout(() => msg.remove(), 400);
    }, 4000);
  });
});
