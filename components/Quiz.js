import React, { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS, BASE_URL } from '../api';
import useStateContext from '../hooks/useStateContext';
import { Card, CardContent, CardMedia, CardHeader, List, ListItemButton, Typography, Box, LinearProgress } from '@mui/material';
import { getFormatedTime } from '../helper';
import { useNavigate } from 'react-router';
import * as signalR from '@microsoft/signalr';

export default function Quiz() {
    const [qns, setQns] = useState([]);
    const [qnIndex, setQnIndex] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const { context, setContext } = useStateContext();
    const navigate = useNavigate();

    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken((prev) => prev + 1);
        }, 1000);
    };

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: [],
        });

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(BASE_URL + 'GetStartExam') // Adjust the hub path as needed
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            console.log('SignalR Connected');
        });

        connection.on('ReceiveExamStatus', (examStart) => {
            console.log(examStart);
            setContext({ examStarted: examStart, examEnded: !examStart });
        });

        createAPIEndpoint(ENDPOINTS.question)
            .fetch()
            .then((res) => {
                setQns(res.data);
                startTimer();
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {
            clearInterval(timer);
        };
    }, []);

    // Use useEffect to trigger the API call when examStart changes
    useEffect(() => {
        if (context.examStarted !== undefined) {
            // Assuming you have a participant ID, replace '1' with the actual participant ID
            createAPIEndpoint(ENDPOINTS.getStartExam)
                .getStartExam(1)
                .then((res) => {
                    // Handle the response if needed
                    console.log(res);
                })
                .catch((err) => {
                    // Handle the error if needed
                    console.log(err);
                });
        }
    }, [context.examStarted]);

    const updateAnswer = (qnId, optionIdx) => {
        const temp = [...context.selectedOptions];
        temp.push({
            qnId,
            selected: optionIdx,
        });
        if (qnIndex < 4) {
            setContext({ selectedOptions: [...temp] });
            setQnIndex(qnIndex + 1);
        } else {
            setContext({ selectedOptions: [...temp], timeTaken });
            navigate('/result');
        }
    };

    return (
        <div>
            {context.examStarted ? (
                qns.length !== 0 ? (
                    <Card
                        sx={{
                            maxWidth: 640,
                            mx: 'auto',
                            mt: 5,
                            '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' },
                        }}
                    >
                        <CardHeader
                            title={'Question ' + (qnIndex + 1) + ' of 5'}
                            action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
                        />
                        <Box>
                            <LinearProgress variant="determinate" value={(qnIndex + 1) * 100 / 5} />
                        </Box>
                        <CardContent>
                            <Typography variant="h6">{qns[qnIndex].qnInWords}</Typography>
                            <List>
                                {qns[qnIndex].options.map((item, idx) => (
                                    <ListItemButton
                                        disableRipple
                                        key={idx}
                                        onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}
                                    >
                                        <div>
                                            <b>{String.fromCharCode(65 + idx) + ' . '}</b>
                                            {item}
                                        </div>
                                    </ListItemButton>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                ) : null
            ) : (
                <Typography variant="h4" sx={{ textAlign: 'center', mt: 5 }}>
                    {context.examEnded ? 'Waiting for the host...' : 'The exam has not started yet.'}
                </Typography>
            )}
        </div>
    );
}
