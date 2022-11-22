import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// next
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------
import { useSnackbar } from 'notistack';

export default function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 1) router.push('/user/list');
      else router.push('/appointment/list');
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required('Số điện thoại là bắt buộc'),
    password: Yup.string().required('Password is required').min(8, 'Mật khẩu phải có ít nhất 8 kí tự'),
  });

  const defaultValues = {
    phone: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    try {
      const res = await login(data.phone, data.password);
      enqueueSnackbar('Đăng nhập thành công', { autoHideDuration: 3000 });
      if (res.user.role === 1) {
        router.push('/user/list');
      } else router.push('/appointment/list');
    } catch (error) {
      enqueueSnackbar('Tài khoản, mật khẩu không chính xác', { autoHideDuration: 3000, variant: 'error' });
    }
  };

  if (isAuthenticated) return <></>
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="phone" label="Số điện thoại" />

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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <NextLink href={PATH_AUTH.resetPassword} passHref>
          <Link variant="subtitle2">Forgot password?</Link>
        </NextLink>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
