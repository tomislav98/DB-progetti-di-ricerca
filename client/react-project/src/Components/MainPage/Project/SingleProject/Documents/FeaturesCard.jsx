import { Card, Image, Text, Group, Badge, Center, Button, ActionIcon } from '@mantine/core';
import { CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers, IconTrashX, IconDownload } from '@tabler/icons-react';
import classes from './FeaturesCard.module.css';
import { useEffect, useState } from 'react';
import { downloadDocumentsbyId, getToken } from '../../../../../Utils/requests';

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

export function FeaturesCard({ document, isNewlyAdded = false }) {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [ docType, setDocType ] = useState('porcoddio')

  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  const handleDelete = () => {
    console.log('handleDelete')
  }

  const handleDownload = () => {
    const token = getToken()
    downloadDocumentsbyId(document.id, token)

  }

  const handleChange = (event) => {
    setDocType(event.target.value);
  };


  useEffect(() => {
    console.log(document);
  }, []);

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src={document.image_preview ? `data:image/png;base64,${document.image_preview}` : "https://img.freepik.com/premium-vector/pdf-file-icon-flat-design-graphic-illustration-vector-pdf-icon_676691-2007.jpg?w=826"} alt="Tesla Model S" />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{isNewlyAdded ? document.name : document.metadata.name}</Text>
          <Text fz="xs" c="dimmed">
            Today: {document.metadata ? document.metadata.created : getCurrentTime()}
          </Text>
        </div>

        <div className='row w-100' >
          <div className='col-6'>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-select-small"
                value={docType}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={10}>DMP</MenuItem>
                <MenuItem value={20}>Ethics</MenuItem>
                <MenuItem value={30}>Deliverable</MenuItem>
              </Select>
            </FormControl>
          </div>
          {!isNewlyAdded ?
            <div className='col-6 d-flex' style={{columnGap:'10px'}}>
              <ActionIcon variant="default" color="grey" size="lg" radius="md" onClick={handleDownload}>
                <IconDownload size="1.1rem" />
              </ActionIcon>
              <ActionIcon variant="filled" color="red" size="lg" radius="md" onClick={handleDelete}>
                {deleteLoading ? <CircularProgress color='inherit' /> : <IconTrashX size="1.1rem" />}
              </ActionIcon>
            </div>
            :
            null
          }
        </div>
      </Group>
    </Card>
  );
}
