import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { FiUpload } from 'react-icons/fi'
import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
};

const Dropzone: React.FC<Props> = ({ onFileUploaded }) =>  {
  const [fileSelected, setFileSelected] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const urlFile = URL.createObjectURL(file);

    setFileSelected(urlFile);
    onFileUploaded(file);
  }, [onFileUploaded])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept: 'image/*'
    })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      
      { fileSelected
        ?
          <img src={fileSelected} alt=""/>  
        : (
          <p>
            <FiUpload />
            Image do estabelecimento
          </p> 
          )
      }
    </div>
  )
};

export default Dropzone;