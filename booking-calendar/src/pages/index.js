import { useEffect, useState } from 'react';
// layouts
import Page from '../components/Page';
// components
// @mui
import { Card, Container, Stack, Typography, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
// hook form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField, RHFSelect, RHFCalendar, RHFTimePicker } from '../components/hook-form';

// ----------------------------------------------------------------------
import { format } from 'date-fns';
// @noti
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------
import { createAppointment } from '../apis/appointment';
import { getTypeUser } from '../apis/user';

export default function Appoinment() {
  // default value
  const defaultValues = {
    user_name: '',
    user_email: '',
    user_id: '',
    user_ccid: '',
    user_phone: '',
    date: format(new Date(Date.now()), 'yyyy-MM-dd'),
    time: new Date(Date.now()),
    description: '',
  };

  const { enqueueSnackbar } = useSnackbar();

  const appoimentSchema = Yup.object().shape({
    user_name: Yup.string().required('Hãy nhập vào tên của bạn'),
    user_email: Yup.string().email('Hãy nhập đúng định dạng email').required('Hãy nhập vào email'),
    user_phone: Yup.string().required('Nhập vào số điện thoại của bạn'),
    date: Yup.string().required('Nhập vào ngày hẹn'),
    time: Yup.string().required('Nhập vào số thời gian hẹn'),
    user_ccid: Yup.string().required('Nhập vào số ccid của bạn'),
    user_id: Yup.string().required('Hãy chọn người cần gặp'),
  });

  const methods = useForm({
    resolver: yupResolver(appoimentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      data.time = format(new Date(data.time), 'HH:mm');
      data.date = format(new Date(data.date), 'yyyy-MM-dd');
      await createAppointment(data);
      enqueueSnackbar('Tạo cuộc gặp mặt mới thành công', { autoHideDuration: 3000 });
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getTypeUser();
      setUsers(data);
    };

    getUsers();
  }, []);

  const [users, setUsers] = useState([]);

  return (
    <Page title="Appoinment form" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Tạo cuộc gặp mặt mới
        </Typography>

        <Card sx={{ p: 2 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} mb={2}>
              {/* name */}
              <RHFTextField label="Tên của bạn" name="user_name" />

              {/* email, phonenumber */}
              <Stack direction="row" spacing={2}>
                <RHFTextField label="Email" name="user_email" />
                <RHFTextField label="Số điện thoại" name="user_phone" />
              </Stack>

              <RHFTextField label="Số CCID" name="user_ccid" />
              <RHFTextField label="Mô tả" name="description" />

              <RHFSelect label="Người cần gặp" name="user_id">
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Stack direction="row" spacing={2}>
                <RHFCalendar name="date" />
                <RHFTimePicker name="time" />
              </Stack>
            </Stack>

            {/* Loading button */}
            <Stack direction="row">
              <LoadingButton loading={isSubmitting} size="large" type="submit" variant="contained" sx={{ marginLeft: 'auto' }}>
                Tạo mới
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}
