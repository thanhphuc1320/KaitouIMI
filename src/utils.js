import { toast } from 'react-toastify';
import moment from 'moment';
import { oldUploadFileApiCall, getPublicUrlApiCall } from './apiCalls/file.api';

export const createDefaultError = (e) => {
  const errRes = e.response;
  let errors;
  if (!errRes) {
    errors = {
      server: {
        msg: 'SOME_THING_WENT_WRONG',
      },
    };
  } else {
    errors = errRes.data.errors || {};
  }
  return errors;
};

export function setTokenToLocalStorage(key, value) {
  return Promise.resolve().then(() => {
    localStorage.setItem(key, value);
  });
}

export function getTokenFromLocalStorage(key) {
  return localStorage.getItem(key);
}

export const validateEmail = (email) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  );

export const validatePassword = (password) =>
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,15}$/.test(password);

export const validateRole = (role) => role === 'Patient' || role === 'Doctor';

export const convertToDiseaseName = (type) => {
  const diseases = {
    5: 'Flash Record Reader',
    1: 'Cancer',
    2: 'General',
    3: 'Liver',
    4: 'Diabetes',
  };
  return diseases[type];
};

export const convertToTitle = (type) => {
  const titleVideo = {
    1: 'Thank you, your video is ready.',
    2: 'Show your facial expression in 10 sec',
    3: 'Say “A’ in 5 sec',
    4: 'Show injured areas if any and tell your concern in 15 sec',
    5: 'This video will help doctors to screen for certain disease',
  };
  return titleVideo[type];
};

export const isURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const isPhoneNumber = (phoneNumber) => {
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneNumber.match(phoneno);
};

export const convertDate = (date, type) => {
  const dateToConvert = new Date(date);
  if (type === 'string') {
    return dateToConvert.toString();
  }
  return dateToConvert.getTime();
};

export const convertToLocaleDateString = (date) => {
  return new Date(date).toLocaleDateString() || '';
};

export const convertMilisecondToDate = (miliseconds) => {
  let today = new Date(miliseconds);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

  today = `${mm}/${dd}/${yyyy}`;
  return miliseconds ? today : 'N/A';
};

export const convertMilisecondToDateForPatient = (miliseconds) => {
  return moment(miliseconds).format('MMM DD, YYYY');
};

export const formatAMPM = (date) => {
  if (!(date instanceof Date)) date = new Date(date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return [hours + ':' + minutes + ampm];
};

export const checkIsImageURL = (url) =>
  url.match(/\.(jpeg|jpg|gif|png)$/) != null;

export const convertToStatusName = (status) => {
  const statuses = {
    0: 'Pending',
    1: 'Approved',
    2: 'Completed',
    3: 'Rejected',
    4: 'Pending',
  };

  return statuses[status] || 'N/A';
};

export const convertToGenderName = (gender) => {
  const genders = {
    1: 'Male',
    2: 'Female',
    3: 'Other',
  };

  return genders[gender] || 'N/A';
};

// Patient Medical history
export const convertIsSmoking = (isSmoking) => {
  const isSmokingMap = {
    0: 'No',
    1: 'light smoker (<= 1 pack/day)',
    2: 'Heavy Smoker (> 1 pack/day)',
  };

  return isSmokingMap[isSmoking] || 'N/A';
};

export const convertSmokingYear = (smokingYear) => {
  const smokingYearMap = {
    0: 'Less than 10 years',
    1: '10-30 years',
    2: 'More than 30 years',
  };

  return smokingYearMap[smokingYear] || 'N/A';
};

export const convertDrinkingAlcohol = (drinkingAlcohol) => {
  const drinkingAlcoholMap = {
    0: 'No',
    1: 'Moderate Drinker (<= 2 beer bottles/day)',
    2: 'Heavy Drinker (> 2 beer bottles/day)',
  };

  return drinkingAlcoholMap[drinkingAlcohol] || 'N/A';
};

export const convertFamilyDisease = (familyDisease) => {
  return familyDisease
    ? Object.keys(familyDisease)
        .filter((key) => familyDisease[key] === 1)
        .join(', ')
    : 'N/A';
};

/**
 * TOAST
 */
export let toastId = null;
export const notify = () =>
  (toastId = toast('Uploading File..', {
    className: 'toast-container',
    autoClose: 3000,
  }));

export const notifyAddingComment = () =>
  (toastId = toast('Adding Comment...', {
    className: 'toast-container',
  }));

export const notifyChangingStatus = () =>
  (toastId = toast('Updating Status...', {
    className: 'toast-container',
  }));

export const notifyGeneratingPdf = () =>
  (toastId = toast('Generating and Upload Pdf...', {
    className: 'toast-container',
  }));

export const notifyUpdatingRequest = () =>
  (toastId = toast('Updating Request...', {
    className: 'toast-container',
    autoClose: 4000,
  }));

export const notifyExportingRequest = () =>
  (toastId = toast('Exporting Request...', {
    className: 'toast-container',
    autoClose: 1000,
  }));

export const notifyExportedRequest = () => {
  toast.update(toastId, {
    render: 'Exported Request',
    type: toast.TYPE.INFO,
    className: 'update-toast-container',
    progressClassName: 'update-progress-bar',
    autoClose: 1000,
  });
};

export const notifyUpdatingAnnotation = () =>
  (toastId = toast('Update Anottation', {
    className: 'toast-container',
    autoClose: 3000,
  }));
export const updateRequestFailed = () => {
  toast.error('Update status failed', {
    className: 'error-toast-container',
    autoClose: 10000,
  });
};

export const updataRequestForFilteredFailed = () => {
  toast.error('Update status failed', {
    className: 'error-toast-container',
    autoClose: 10000,
  });
};

export const updateRequestSuccess = () => {
  toast.update(toastId, {
    render: 'Request updated',
    type: toast.TYPE.INFO,
    className: 'update-toast-container',
    progressClassName: 'update-progress-bar',
    autoClose: 1000,
  });
};

export const dismiss = () => toast.dismiss(toastId);
// export const notifyOcrComplete = () =>
//   (toastId = toast('OCR Complete', {
//     className: 'toast-container',
//     autoClose: 2000,
//   }));

export const notifyOcrStarting = () =>
  (toastId = toast(`Processing OCR, we'll notify you when it's ready`, {
    className: 'toast-container',
    autoClose: 2500,
  }));

export const uploadMultiple = (uploadingData, index) => {
  return new Promise(function (resolve) {
    oldUploadFileApiCall(uploadingData)
      .then((res) => {
        const { originalFileName, fileType, fileUrl } = res.data;
        getPublicUrlApiCall({ itemUrl: fileUrl, redirect: false })
          .then((resDataPublic) => {
            if (!resDataPublic.data.code) {
              const { signedUrl } = resDataPublic.data;
              const uploadedFile = {
                fileName: originalFileName,
                fileType,
                fileUrl,
                publicFileUrl: signedUrl,
              };
              resolve(uploadedFile);
            }
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  });
};
