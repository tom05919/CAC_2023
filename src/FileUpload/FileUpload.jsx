import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './FileUpload.scss'

const FileUpload = ({files, setFiles}) => {
    const uploadHandler = (event) => {
      const file = event.tagret.files[0];
      file.isUploading = true;
      setFiles([...files, file])

      const fromData = new FormData()
      FormData.append(
        file.name,
        file,
        file.name
      )
    }
  return (
    <>
        <div className="upload-card">
            <div className="upload-inputs">
                <input type="file" onChange={uploadHandler}/>
                <button>
                  <i>
                    <FontAwesomeIcon icon={faPlus} />
                  </i>
                  Upload
                </button>
            </div>
        </div>
    </>
  )
}

export default FileUpload