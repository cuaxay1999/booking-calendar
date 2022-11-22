import { useState } from 'react';

import { useSnackbar } from 'notistack';
// @mui
import { Card, Container, Typography, Stack, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// hook form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField, RHFSelect } from '../../components/hook-form';

// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// ----------------------------------------------------------------------
import { createUser } from '../../apis/user';

import { useRouter } from 'next/router';
// ----------------------------------------------------------------------
const ROLE = {
  ASSISTANT: 2,
  USER: 3,
};
// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function UserList() {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const userCreateSchema = Yup.object().shape({
    name: Yup.string().required('Hãy nhập vào tên của bạn'),
    email: Yup.string().email('Hãy nhập đúng định dạng email').required('Hãy nhập vào email'),
    phone: Yup.string().required('Nhập vào số điện thoại của bạn'),
    password: Yup.string().required('Nhập vào ngày hẹn').min(8, 'Mật khẩu cần ít nhất 8 kí tự'),
  });

  // default value
  const defaultValues = {
    role: '',
  };

  const methods = useForm({
    resolver: yupResolver(userCreateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await createUser(data);
      enqueueSnackbar('Tạo user mới thành công', { autoHideDuration: 3000 });
      reset();
      router.push('/user/list');
    } catch (err) {
      enqueueSnackbar('Đã có lỗi xảy ra. Vui lòng thử lại sau', { autoHideDuration: 3000, variant: 'error' });
    }
  };

  return (
    <Page title="User: Add">
      <Container>
        <Typography gutterBottom variant="h3">
          Thêm mới user
        </Typography>

        <Card sx={{ p: 2 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} mb={2}>
              {/* name */}
              <RHFTextField label="Tên" name="name" />

              {/* email, phonenumber */}
              <Stack direction="row" spacing={2}>
                <RHFTextField label="Số điện thoại" name="phone" />
                <RHFTextField label="Email" name="email" />
              </Stack>

              <RHFTextField
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFSelect label="Quyền hạn" name="role">
                {Object.keys(ROLE).map((role) => (
                  <MenuItem key={role} value={ROLE[role]}>
                    {role}
                  </MenuItem>
                ))}
              </RHFSelect>
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
