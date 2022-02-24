import React, { useState } from "react";
import axios from "axios";

function App() {
    const [uploadFile, setUploadFile] = useState("")

    const handleFileReader = (event) => {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e) => {
            setUploadFile({data:reader.result.split(',').pop(),fileName:event.target.files[0].name})
        };
    }

    const uploadHandler = () => {
        axios.post('https://localhost:5000/uploaded_file', uploadFile)
    };

    return (
        <div className="App">
            <label>Select a Folder</label>
            <input
                onChange={handleFileReader}
                type="file"
                accept=".zip,.rar,.7zip"
            />
            <button onClick={uploadHandler}>
                Upload Folder
            </button>
        </div>
    );
}


(function() {
    'use strict';

    var fileInput = document.querySelector('#form-file');
    var output = document.querySelector('#output');

    /**
     * @{@link  https://www.html5rocks.com/en/tutorials/file/dndfiles/}
     */
    function handleChange(e) {
        var files = e.target.files;

        for (var i = 0, f; f = files[i]; i++) {
            if (f.type.match('zip')) {
                var reader = new FileReader();

                reader.onerror = errorHandler;
                reader.onabort = errorHandler;
                reader.onload = function(e) {
                    var zip = new JSZip();
                    zip.load(e.target.result);
                    var zippedFiles = zip.files;
                    Object.keys(zippedFiles).forEach(function(key) {
                        if (key.indexOf('__') !== 0) {
                            output.innerText = output.innerText + zippedFiles[key].asText();
                        }
                    });
                };

                reader.readAsBinaryString(f);
            }
        }
    }

    function errorHandler(error) {
        console.error(error);
    }

    fileInput.addEventListener('change', handleChange, false);
})();