import { useRef } from 'react';
import { Text, Group, Button, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { Chip } from '@mui/material';
import classes from './dropzone.scss';

function DropzoneButton() {
  const theme = useMantineTheme();
  const openRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleDelete = () => {
    console.log('first')
  }

  const handleDrop = (files) => {
    // Verifica se è stato caricato almeno un file
    if (files.length > 0) {
      // Ottieni il nome del file dal primo file caricato
      const fileName = files[0].name;
      setUploadedFileName(fileName);
    }
  };
  return (
    <div className={classes.wrapper}>
      <div className='row'>
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
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.red[6]}
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
      <div className='row'>
        <div className='col-12'>
          {uploadedFileName && (
            <Chip label={uploadedFileName} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DropzoneButton;