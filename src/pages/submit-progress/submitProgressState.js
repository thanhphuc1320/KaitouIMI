const submitProgressState = {
  data: {
    type: 1,
    addedInfo: [],
    bloodTest: [],
    radiology: [],
    biopsy: [],
    uploads: [
      {
        id: 1,
        title: 'Blood Test',
        uploadInfo: 'Upload Blood Test document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'bloodTest',
        value: null,
      },
      {
        id: 2,
        title: 'Radiology',
        uploadInfo: 'Upload Radiology document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'radiologyTest',
        value: null,
      },
      {
        id: 3,
        title: 'Biopsy',
        uploadInfo: 'Upload Biopsy document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'biopsyTest',
        value: null,
      },
    ],
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
    uploads: [
      {
        id: 1,
        title: 'Blood Test',
        uploadInfo: 'Upload Blood Test document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'bloodTest',
        value: null,
      },
      {
        id: 2,
        title: 'Radiology',
        uploadInfo: 'Upload Radiology document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'radiologyTest',
        value: null,
      },
    ],
    requires: ['bloodTest'],
    optionals: ['radiology'],
    defaultQuestions: [
      'Is my diagnosis correct?',
      'Is there anything that I should be concerned about?',
      'What can I do to improve my health without taking medicine?',
      'Do I need to take any medicine?',
      'Are there any specific tests I need to have?',
    ],
  },
  liverData: {
    type: 3,
    addedInfo: [],
    bloodTest: [],
    radiology: [],
    uploads: [
      {
        id: 1,
        title: 'Blood Test',
        uploadInfo: 'Upload Blood Test document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'bloodTest',
        value: null,
      },
      {
        id: 2,
        title: 'Radiology',
        uploadInfo: 'Upload Radiology document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'radiologyTest',
        value: null,
      },
    ],
    requires: ['bloodTest'],
    optionals: ['radiology'],
    defaultQuestions: [
      'How severe is my liver disease?',
      'Are there any herbs/natural products that I can take for my liver diseases?',
      'What can I eat/avoid to eat for my liver disease?',
    ],
  },
  cancerData: {
    type: 1,
    addedInfo: [],
    bloodTest: [],
    radiology: [],
    biopsy: [],
    uploads: [
      {
        id: 1,
        title: 'Blood Test',
        uploadInfo: 'Upload Blood Test document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'bloodTest',
        value: null,
      },
      {
        id: 2,
        title: 'Radiology',
        uploadInfo: 'Upload Radiology document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'radiologyTest',
        value: null,
      },
      {
        id: 3,
        title: 'Biopsy',
        uploadInfo: 'Upload Biopsy document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'biopsyTest',
        value: null,
      },
    ],
    requires: ['bloodTest', 'biopsy'],
    optionals: ['radiology'],
    defaultQuestions: [
      'Is my diagnosis correct?',
      'How long do I have to live?',
      'What treatment can I have?',
    ],
  },
  diabetesData: {
    type: 4,
    addedInfo: [],
    bloodTest: [],
    urineTest: [],
    uploads: [
      {
        id: 1,
        title: 'Blood Test',
        uploadInfo: 'Upload Blood Test document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'bloodTest',
        value: null,
      },
      {
        id: 2,
        title: 'Urine Test',
        uploadInfo: 'Upload Urine Test document',
        accept: 'file_extension,video/*,image/*,application/pdf',
        buttonLabel: 'Upload',
        fileTestType: 'urineTest',
        value: null,
      },
    ],
    requires: ['bloodTest', 'urineTest'],
    optionals: [],
    defaultQuestions: [
      'What can I do to improve my health without taking medicine?',
      'Do I need to take any medicine?',
      'Is there anything else that I should be concerned about?',
    ],
  },
};

export default submitProgressState;
