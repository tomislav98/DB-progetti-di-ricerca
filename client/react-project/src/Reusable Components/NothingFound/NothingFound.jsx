import { Container, Title, Text, Group, Button } from "@mantine/core";
import { Illustration } from "../../Components/MainPage/Project/Projects";

import classes from './NothingFound.module.css';

export function NothingFound({ title = 'Nothing to see here', text = 'Sample text', onButtonPress, buttonLabel='Click me' }) {
    function handleClick() {
        onButtonPress();
    }
    return (
        <Container className={classes.mantineroot}>
            <div className={classes.mantineinner}>
                <Illustration className={classes.mantineimage} />
                <div className={classes.mantinecontent}>
                    <Title className={classes.mantinetitle} style={{ marginBottom: '35px' }}> {title} </Title>
                    <Text classNames='' c="dimmed" size="lg" ta="center" className={classes.mentinedescription} style={{ margin: '10px', marginBottom: '25px' }}>
                        {text}
                    </Text>
                    {
                        onButtonPress ?
                        <Group classNames='' justify="center">
                            <Button size="md" onClick={handleClick}>{buttonLabel}</Button>
                        </Group>
                        :
                        null
                    }
                </div>
            </div>
        </Container>
    );
}