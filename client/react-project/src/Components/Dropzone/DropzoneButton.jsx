import { useRef, useState } from 'react';
import { Text, Group, Button, rem} from '@mantine/core';
import { Chip } from '@mui/material';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from './dropzone.scss';

function DropzoneButton({ onFilesUploaded, uploadedFilesprops }) {
  const openRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState(uploadedFilesprops);


  const handleDrop = (files) => {
    // Aggiungi i file caricati allo stato
    setUploadedFiles(uploadedFiles.concat(files));

    // Call the onFilesUploaded function to pass the files up to MySteps
    onFilesUploaded(uploadedFiles.concat(files));
  };

  const handleFileDelete = (index) => {
    // Rimuovi il file dall'array dei file caricati
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles.splice(index, 1);
    setUploadedFiles(newUploadedFiles);
  };
  
  
  return (
    <div className={classes.wrapper}>
      <div className='row '>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          className={classes.dropzone}
          radius="md"
          accept={[MIME_TYPES.pdf]}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload
                  style={{ width: rem(50), height: rem(50) }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
              <Dropzone.Idle>Upload resume</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
              are less than 30mb in size.
            </Text>
            <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
              Select files
            </Button>
          </div>
        </Dropzone>
      </div>
      <div className='row dropzone-row'>
        <div className='col-12'>
          {uploadedFiles.map((file, index) => (
            <Chip key={index} label={file.name}  onDelete={() => handleFileDelete(index)} />
          ))}
        </div>
      </div>
    </div >
  );
}

export default DropzoneButton;