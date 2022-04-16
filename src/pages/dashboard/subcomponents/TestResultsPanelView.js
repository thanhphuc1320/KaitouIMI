import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';
import { DropDownMenu, MenuItem } from 'material-ui';
import DatePickerWithCalendar from '../../../components/datepickers/datepickerCalendar';
import {
  IMAGE_MODE,
  IMAGE_TYPES,
  PDF_MODE,
  PDF_TYPE,
} from '../../../constant.js';
import { isURL } from '../../../utils';
import styles from '../styles';
import PdfPreview from '../../../components/dialog/pdfPreview';
import ReactPlayer from 'react-player';

const TestResultsPanelView = ({ currentRequest }) => {
  const testOptions = [
    'Biopsy',
    'Blood Test',
    'Radiology',
    'Urine Test',
    'Video',
  ];
  const { _id } = currentRequest;

  const initialPreviewState = { linkFileToOpen: null, fileTypeToOpen: null };

  const [tests] = useState(currentRequest.tests);
  const [pageNumber] = useState(1);
  const [selectedTestOption, setSelectedTestOption] = useState(0);
  const [testWithPublicLink, setTestWithPublicLink] = useState([]);
  const [ selectedDate, setSelectedDate] = useState(moment());
  const [previewState, setPreviewState] = useState(initialPreviewState);


  const test = tests[selectedTestOption];
  console.log('TestResultsPanelView -> test', test);

  useEffect(() => {
    tests[selectedTestOption].map(async (item) => {
      const data = {
        itemUrl: item.ocrFileUrl || item.fileUrl,
        redirect: false,
        requestId: _id,
      };

      await getPublicUrlApiCall(data)
        .then((res) => {
          if (!res.data.code)
            setTestWithPublicLink(
              testWithPublicLink.concat([
                {
                  ocrFileUrl: data.itemUrl,
                  signedUrl: res.data.signedUrl,
                  fileType: item.fileType,
                },
              ])
            );
        })
        .catch((e) => console.log(e));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTestOption]);

  let dates = [];
  if (test && test.length > 0) {
    dates = test.map((test) => moment(test.createdAt));
    dates = [...new Set(dates)];
  }
  const { linkFileToOpen, fileTypeToOpen } = previewState;

  let fileModeToOpen;
  const isImage = IMAGE_TYPES.includes(fileTypeToOpen);
  if (isImage) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;
  else fileModeToOpen = 'video';
  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const openFilePreview = (linkFileToOpen, fileTypeToOpen) => {
    if (isURL(linkFileToOpen) && fileTypeToOpen)
      setPreviewState({ linkFileToOpen, fileTypeToOpen });
  };

  const openCloudPublicUrl = (itemUrl, redirect) => {
    const data = { itemUrl, redirect: redirect };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          openFilePreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <div className="block-result">
        <div className="title-result clearfix">
          <div className="left-title">
            <DropDownMenu
              value={selectedTestOption}
              onChange={(e, index, value) => {
                setTestWithPublicLink([]);
                setSelectedTestOption(value);
              }}
            >
              {testOptions.map((opt, index) => (
                <MenuItem value={index} primaryText={opt} />
              ))}
            </DropDownMenu>
          </div>
          <div className="right-title">
            {dates && dates.length > 0 && (
              <DatePickerWithCalendar
                selectedDays={dates}
                setSelectedDate={setSelectedDate}
              />
            )}
          </div>
        </div>
        <div className="image-resule">
          {testWithPublicLink.map((item, idx) => {
           openCloudPublicUrl(item.ocrFileUrl, false, item.fileType);
            return (
              <div
              >
                {selectedTestOption !== 4 && isImage && (
                  <img src={item.signedUrl} alt='' />
                )}
                {selectedTestOption !== 4 && !isImage && (
                  <PdfPreview pageNumber={pageNumber} file={item.signedUrl} />
                )}

                {selectedTestOption === 4 && (
                  <ReactPlayer
                    url={item.fileUrl}
                    width="100%"
                    height="100%"
                    playing="true"
                    controls="true"
                  />
                )}
              </div>
            );
          })}
        </div>
        <ul className="list-result">
          {test.map((item, index) =>
            item.ocrJson[0]
              ? item.ocrJson[0].info.map((annotateResult, i) => (
                  <li>
                    <span className="num">{i + 1}</span>
                    <span style={styles.annotationInfo}>
                      {annotateResult.glossary.content}
                    </span>
                  </li>
                ))
              : null
          )}
        </ul>
      </div>
    </div>
  );
};

export default TestResultsPanelView;
