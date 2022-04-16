import React from 'react';
import { pdfjs } from 'react-pdf';

import 'react-toastify/dist/ReactToastify.css';
import '../../static/css/flash-record.css';
import { useHistory } from "react-router-dom";



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function SubmitProgressPage(props) {
  const history = useHistory();
  const onBack = () => {
    history.push("/my-requests");
  };
  return (
    <div className="flash-record-page">
      <div className="flash-record-content">
        <p className="text-center">Submit process has completed!</p>
        <div className="form-group text-center">
          <button className="btn btn-blue" onClick={() => onBack()}>Back To home</button>
        </div>
      </div>
    </div>
  );
}
