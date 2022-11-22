import { useState, useEffect } from 'react';

// components
import Layout from '../../layouts';
import Page from '../../components/Page';
import { FormProvider, RHFCalendar, RHFTimePicker } from '../../components/hook-form';
import Scrollbar from '../../components/Scrollbar';
import { TableNoData } from '../../components/table';
// ----------------------------------------------------------------------

// @mui
import { Box, Card, Container, TableHead, Typography, TableContainer, TableRow, TableBody, TableCell, Table, Stack, TextField } from '@mui/material';
import Label from '../../components/Label';

import DialogAnimate from '../../components/animate/DialogAnimate';
// ----------------------------------------------------------------------
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { getAppointments, finishAppointment, cancelAppointment, acceptAppointment, searchAppointment } from '../../apis/appointment';

import { format } from 'date-fns';
import { PropTypes } from 'prop-types';

Appoinment.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

const APPOINMENT_STATUS = {
  WATING: 1,
  ACCEPTED: 2,
  CANCEL: 3,
  DONE: 4,
};

export default function Appoinment() {
  const [tableData, setAppointment] = useState([]);

  useEffect(() => {
    const getApppointmentData = async () => {
      const { data, count } = await getAppointments();
      setAppointment(data);
      if (!count) setIsNotFound(true);
    };
    getApppointmentData();
  }, []);

  const headLabel = [
    { id: 1, label: 'Họ và tên' },
    { id: 2, label: 'Email' },
    { id: 3, label: 'Số điện thoại' },
    { id: 4, label: 'Thời gian' },
    { id: 5, label: 'CCID' },
    { id: 10, label: 'Mô tả' },
    { id: 6, label: 'Trạng thái' },
    { id: 7, label: '' },
  ];

  // form handle

  let defaultValues = {
    accepted_date: '',
    accepted_time: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data) => {
    data.accepted_time = format(new Date(data.accepted_time), 'HH:mm');
    data.accepted_date = format(new Date(data.accepted_date), 'yyyy-MM-dd');
    await acceptAppointment(currentId, data);

    setIsFormOpen(false);
    await updateData();
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [ccid, setCcid] = useState(undefined);
  const [isNotFound, setIsNotFound] = useState(false);

  const updateData = async () => {
    const { data } = await getAppointments();
    setAppointment(data);
  };

  const search = async () => {
    const { data, count } = await searchAppointment(ccid);
    if (!count) {
      setIsNotFound(true);
      setAppointment([]);
    } else {
      setAppointment(data);
      setIsNotFound(false);
    }
  };

  const openForm = (data) => {
    setIsFormOpen(true);
    setCurrentId(data.id);
    setValue('accepted_date', format(new Date(data.date), 'yyyy-MM-dd'));
    setValue('accepted_time', new Date(`${data.date} ${data.time}`));
  };

  const theme = useTheme();
  const getLabelInfor = (status) => {
    const convertedStatus = Number(status);
    switch (convertedStatus) {
      case APPOINMENT_STATUS.WATING:
        return (
          <Label sx={{ width: '64px' }} color="secondary">
            Waiting
          </Label>
        );
      case APPOINMENT_STATUS.ACCEPTED:
        return (
          <Label sx={{ width: '64px' }} color="info">
            Accepted
          </Label>
        );
      case APPOINMENT_STATUS.CANCEL:
        return (
          <Label sx={{ width: '64px' }} color="warning">
            Cancel
          </Label>
        );
      case APPOINMENT_STATUS.DONE:
        return (
          <Label sx={{ width: '64px' }} color="success">
            Done
          </Label>
        );
    }
  };

  return (
    <Page title="Appoinment List">
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>
          Danh sách cuộc họp
        </Typography>

        <DialogAnimate open={isFormOpen}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ pb: 3 }}>
              Xác nhận thời gian gặp mặt
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="row" spacing={2} mb={3}>
                <RHFCalendar name="accepted_date" />
                <RHFTimePicker name="accepted_time" />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'end' }}>
                <LoadingButton
                  loading={false}
                  size="medium"
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: theme.palette.warning.dark }}
                  onClick={() => setIsFormOpen(false)}
                >
                  Hủy
                </LoadingButton>
                <LoadingButton loading={false} size="medium" type="submit" variant="contained">
                  Chấp nhận
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </DialogAnimate>

        {/* search form */}

        <Stack spacing={3} mb={2} direction="row">
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Ccid"
            defaultValue={ccid}
            onChange={(e) => setCcid(e.target.value)}
            sx={{ width: '40%' }}
          />
          <LoadingButton
            loading={false}
            size="large"
            type="submit"
            variant="contained"
            sx={{ marginLeft: 'auto', width: '120px', height: '56px' }}
            onClick={() => search()}
          >
            Tìm kiếm
          </LoadingButton>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative', paddingTop: '8px' }}>
              {/* table main content */}
              <Table size="medium">
                {/* header */}
                <TableHead>
                  <TableRow>
                    {headLabel.map((headCell) => (
                      <TableCell key={headCell.id} align={headCell.align || 'center'} sx={{ width: headCell.width, minWidth: headCell.minWidth }}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="center">{row.user_name}</TableCell>
                      <TableCell align="center">{row.user_email}</TableCell>
                      <TableCell align="center">{row.user_phone}</TableCell>
                      <TableCell align="center">{`${row.accepted_time} ${row.accepted_date}`} </TableCell>
                      <TableCell align="center">{row.user_ccid}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{getLabelInfor(row.status)}</TableCell>
                      <TableCell align="right">
                        <ActionButton status={row.status} id={row.id} updateData={() => updateData()} openForm={() => openForm(row)} />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}

// ActionButton.PropTypes = {};

const ActionButton = ({ status, id, updateData, openForm }) => {
  const isSubmitting = false;

  const theme = useTheme();

  const handleAppointmentAction = async (id, flag) => {
    try {
      switch (flag) {
        case APPOINMENT_STATUS.ACCEPTED:
          openForm();
          break;
        case APPOINMENT_STATUS.CANCEL:
          await cancelAppointment(id);
          break;
        case APPOINMENT_STATUS.DONE:
          await finishAppointment(id);
          break;
      }

      updateData();
    } catch (e) {
      console.log(e);
    }
  };

  switch (status) {
    case APPOINMENT_STATUS.WATING:
      return (
        <Stack spacing={1} sx={{ justifyContent: 'right' }}>
          <LoadingButton
            loading={isSubmitting}
            size="small"
            type="submit"
            variant="contained"
            onClick={() => handleAppointmentAction(id, APPOINMENT_STATUS.ACCEPTED)}
            sx={{ backgroundColor: theme.palette.secondary.main, minWidth: '100px' }}
          >
            Chấp nhận
          </LoadingButton>
          <LoadingButton
            loading={isSubmitting}
            size="small"
            type="submit"
            variant="contained"
            onClick={() => handleAppointmentAction(id, APPOINMENT_STATUS.CANCEL)}
            sx={{ backgroundColor: theme.palette.warning.dark, minWidth: '100px' }}
          >
            Hủy
          </LoadingButton>
        </Stack>
      );

    case APPOINMENT_STATUS.ACCEPTED:
      return (
        <LoadingButton
          loading={isSubmitting}
          size="small"
          type="submit"
          variant="contained"
          fullWidth
          onClick={() => handleAppointmentAction(id, APPOINMENT_STATUS.DONE)}
        >
          Hoàn thành
        </LoadingButton>
      );

    default:
      return null;
  }
};
