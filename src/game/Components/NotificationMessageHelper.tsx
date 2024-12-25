import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppSelector } from "../../hooks";
import store from "../../stores";
import { SetFailureNotificationBool, SetSuccessNotificationBool } from "../../stores/NotificationStore";


const vertical= 'top';
const horizontal = 'center';


export default function NotificationMessageHelper () {
  // const [openSuccessNotificationBool, setOpenBool] = useState(false)

  const openSuccessNotificationBool = useAppSelector((state) => state.notificatinoStore.successNotificationBool)
  const messageSuccessNotificationBool = useAppSelector((state) => state.notificatinoStore.successNotificationMessage)

  const openFailureNotificationBool = useAppSelector((state) => state.notificatinoStore.failureNotificationBool)
  const messageFailureNotificationBool = useAppSelector((state) => state.notificatinoStore.failureNotificationMessage)
  
  const openNewLevelNotificationBool = useAppSelector((state) => state.notificatinoStore.newLevelNotificationBool)
  const messageNewLevelNotificationBool = useAppSelector((state) => state.notificatinoStore.newLevelNotificationMessage)

  const openRewardNotification = useAppSelector((state) => state.notificatinoStore.rewardNotificationBool)
  const rewardNotificationMessage = useAppSelector((state) => state.notificatinoStore.rewardNotificationMessage)

  const handleClose = () => {
    store.dispatch(SetSuccessNotificationBool(false))
    // store.dispatch(SetFailureNotificationBool(false))
  };

  const handleCloseErr = () => {
    // store.dispatch(SetSuccessNotificationBool(false))
    store.dispatch(SetFailureNotificationBool(false))
  };

  const ref = useDetectClickOutside({ onTriggered: handleClose });

  return (
    <div ref={ref}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSuccessNotificationBool}
        autoHideDuration={5000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Success </AlertTitle>
            {messageSuccessNotificationBool}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openFailureNotificationBool}
        autoHideDuration={5000}
        onClose={handleCloseErr}
        key={vertical + horizontal + "sdsdfsd"}
      >
        <Alert onClose={handleCloseErr} severity="error" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Failure </AlertTitle>
            {messageFailureNotificationBool}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openNewLevelNotificationBool}
        autoHideDuration={5000}
        onClose={handleCloseErr}
        key={vertical + horizontal}
      >
        <Alert onClose={handleCloseErr} severity="success" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Congratulations! </AlertTitle>
            {messageNewLevelNotificationBool}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openRewardNotification}
        autoHideDuration={5000}
        onClose={handleCloseErr}
        key={vertical + horizontal}
      >
        <Alert onClose={handleCloseErr} severity="success" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> GET! </AlertTitle>
            {rewardNotificationMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}