const bloodTestUpload = {
  title: 'Blood Test',
  uploadInfo: 'Upload Blood Test document',
  id: 'bloodTest',
  accept: 'file_extension,image/*,application/pdf',
  buttonLabel: 'Upload',
  fileTestType: 'bloodTest',
  value: null,
};

const biopsyTestUpload = {
  title: 'Biopsy',
  uploadInfo: 'Upload Biopsy document',
  id: 'biopsy',
  accept: 'file_extension,image/*,application/pdf',
  buttonLabel: 'Upload',
  fileTestType: 'biopsyTest',
  value: null,
};

const radiologyTestUpload = {
  title: 'Radiology',
  uploadInfo: 'Upload Radiology document',
  id: 'radiology',
  accept: 'file_extension,image/*,application/pdf',
  buttonLabel: 'Upload',
  fileTestType: 'radiologyTest',
  value: null,
};

const urineTestUpload = {
  title: 'Urine Test',
  uploadInfo: 'Upload Urine Test document',
  id: 'urineTest',
  accept: 'file_extension,image/*,application/pdf',
  buttonLabel: 'Upload',
  fileTestType: 'urineTest',
  value: null,
};

const createRequestState = {
  cancerData: {
    type: 1,
    addedInfo: [],
    bloodTest: [],
    radiology: [],
    video: [],
    biopsy: [],
    uploads: [bloodTestUpload, biopsyTestUpload, radiologyTestUpload],
    requires: ['bloodTest', 'biopsy'],
    optionals: ['radiology'],
    defaultQuestions: [
      'Is my diagnosis correct?',
      'How long do I have to live?',
      'What treatment can I have?',
    ],
  },
  generalData: {
    type: 2,
    addedInfo: [],
    bloodTest: [],
    radiology: [],
    uploads: [bloodTestUpload, radiologyTestUpload],
    requires: ['bloodTest'],
    optionals: ['radiology'],
    defaultQuestions: [
      'Is my diagnosis correct?',
      'Is there anything that I should be concerned about?',
      'What can I do to improve my health without taking medicine?',
      'Do I need to take any medicine?',
      'Are there any specific tests I need to have?',
    ],
    video: [],
  },
  liverData: {
    type: 3,
    addedInfo: [],
    bloodTest: [],
    radiology: [],
    uploads: [bloodTestUpload, radiologyTestUpload],
    requires: ['bloodTest'],
    optionals: ['radiology'],
    defaultQuestions: [
      'How severe is my liver disease?',
      'Are there any herbs/natural products that I can take for my liver diseases?',
      'What can I eat/avoid to eat for my liver disease?',
    ],
    video: [],
  },

  diabetesData: {
    type: 4,
    addedInfo: [],
    bloodTest: [],
    urineTest: [],
    uploads: [bloodTestUpload, urineTestUpload],
    requires: ['bloodTest', 'urineTest'],
    optionals: [],
    defaultQuestions: [
      'What can I do to improve my health without taking medicine?',
      'Do I need to take any medicine?',
      'Is there anything else that I should be concerned about?',
    ],
  },
};

export default createRequestState;
