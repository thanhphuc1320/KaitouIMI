import Swal from 'sweetalert2';
import { VERSION_ID } from './constant';

const SERVICE_WORKER = 'serviceWorker';
const swalAlert = (id) =>
  Swal.fire({
    title: 'New Version!',
    text: `IMI v-${id} is now availabe. Would you like to reload?`,
    confirmButtonText: 'Reload',
    cancelButtonText: 'Not now',
    showCancelButton: true,
    allowOutsideClick: false,
    reverseButtons: true,
  });

export default () => {
  const { origin } = window.location;

  // is develop environment
  if (origin.includes('localhost')) return;

  const checker = () => {
    const reCheck = () => setTimeout(() => checker(), 30000);

    fetch(`${origin}/static/version.json`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((version) => {
        const currentId = localStorage.getItem(VERSION_ID);
        localStorage.setItem(VERSION_ID, version.id);

        if (currentId && version.id !== currentId) {
          return swalAlert(version.id)
            .then(({ isConfirmed, value }) => {
              (isConfirmed || value) && window.location.reload();

              SERVICE_WORKER in navigator &&
                navigator.serviceWorker
                  .getRegistrations()
                  .then((registrations) =>
                    registrations.forEach((registration) =>
                      registration.unregister()
                    )
                  );

              reCheck();
            })
            .catch(reCheck);
        }

        return reCheck();
      })
      .catch(() => {
        return reCheck();
      });
  };

  return checker();
};