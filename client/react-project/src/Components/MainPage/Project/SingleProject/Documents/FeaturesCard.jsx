import { Card, Image, Text, Group, Badge, Center, Button, ActionIcon, TextInput } from '@mantine/core';
import { CircularProgress, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material'
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers, IconTrashX, IconDownload, IconPencil, IconPencilOff } from '@tabler/icons-react';
import classes from './FeaturesCard.module.css';
import { useEffect, useState } from 'react';
import { downloadDocumentsbyId, getToken } from '../../../../../Utils/requests';
import { DocumentType } from '../../../../../Utils/enums';
import { saveAs } from 'file-saver';

const getCurrentTime = () => {
  const currentDate = new Date();
  const hours = currentDate.getUTCHours();
  const minutes = currentDate.getUTCMinutes();
  return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
};

const mockdata = [
  { label: '4 passengers', icon: IconUsers },
  { label: '100 km/h in 4 seconds', icon: IconGauge },
  { label: 'Automatic gearbox', icon: IconManualGearbox },
  { label: 'Electric', icon: IconGasStation },
];

export function FeaturesCard({ document, isNewlyAdded = false, onChange, isEditable = true }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [docType, setDocType] = useState(DocumentType[document.metadata ? document.metadata.type_document : 'UNDEFINED']);
  const [initialType, setInitialType] = useState(DocumentType[document.metadata ? document.metadata.type_document : 'UNDEFINED'])
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  const handleDelete = () => {
  }

  const handleDownload = async () => {
    const token = getToken();
    const response = await downloadDocumentsbyId(document.id, token);

    const blob = new Blob([response], { type: 'application/pdf' });
    // attualmente settato il nome al titolo del progetto + la versione
    const filename = `[${document.metadata.type_document}] ${document.metadata.name}`;
    saveAs(blob, filename)

  }

  const handleChange = (event) => {
    setDocType(event.target.value);
    setHasChanged(true);

    if (document.metadata)
      onChange(event.target.value, document.metadata.name, document.id);

    else
      onChange(event.target.value, document.name);

  };

  const documentTypes = [
    { value: 0, label: 'Data management plan' },
    { value: 1, label: 'Ethics deliverable' },
    { value: 2, label: 'Scientific report' },
    { value: 3, label: 'Financial budget' },
    { value: 4, label: 'Communication dissemination plan' },
    { value: 5, label: 'Risk analysis' },
    { value: 6, label: 'Letters of support collaboration' },
    { value: 7, label: 'Ethics plan' },
    { value: 8, label: 'CV principal investigators' },
    { value: 9, label: 'Legal documents' },
    { value: 10, label: 'Progress reports' },
    { value: 11, label: 'Undefined' },
  ];

  return (
    <Card withBorder radius="md" className={!hasChanged ? classes.card : classes.cardActive} style={{ borderColor: initialType !== docType ? 'cornflowerblue' : null, height: '500px' }}>
      <Card.Section className={classes.imageSection}>
        <Image style={{ height: '300px' }} src={document.image_preview ? `data:image/png;base64,${document.image_preview}` : "https://img.freepik.com/premium-vector/pdf-file-icon-flat-design-graphic-illustration-vector-pdf-icon_676691-2007.jpg?w=826"} alt="Tesla Model S" />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{isNewlyAdded ? document.name : document.metadata.name}</Text>
          <Text fz="xs" c="dimmed">
            Today: {document.metadata ? document.metadata.created : getCurrentTime()}
          </Text>
        </div>

        <div className='row w-100' >
          <div className={!isNewlyAdded ? 'col-8' : 'col-12'}>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                disabled={initialType === 11 && isEditable ? false : true}
                labelId="demo-simple-select-label"
                id="demo-select-small"
                value={docType}
                label="Type"
                onChange={handleChange}
              // style={{ opacity: isBeingEdited ? 1 : 0.5 }}
              >
                {documentTypes.map((documentType) => (
                  <MenuItem key={documentType.value} value={documentType.value}>
                    {documentType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {(!isNewlyAdded || !isEditable) ?
            <div className='col-4 d-flex' style={{ columnGap: '10px' }}>
              <ActionIcon variant="default" color="grey" size="lg" radius="md" onClick={handleDownload}>
                <IconDownload size="1.1rem" />
              </ActionIcon>
              {isEditable ?
                <ActionIcon variant="filled" color="red" size="lg" radius="md" onClick={handleDelete}>
                  {deleteLoading ? <CircularProgress color='inherit' /> : <IconTrashX size="1.1rem" />}
                </ActionIcon>
                :
                null
              }
            </div>
            :
            null
          }
        </div>
      </Group>
    </Card>
  );
}
