import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showWelcomeAlert = (firstName) => {
  MySwal.fire({
    text:'login success',
    title: `Welcome, ${firstName}!`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};
