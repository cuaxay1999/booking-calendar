import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// hooks
import useAuth from '../../hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import useSettings from '../../hooks/useSettings';
// api
import { getUsers, activeUser, deActiveUser } from '../../apis/user';
// layouts
// components
import Layout from '../../layouts';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';

// @mui
import { useSnackbar } from 'notistack';
import { Card, Container, TableHead, Typography, TableContainer, TableRow, TableBody, TableCell, Table } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Label from '../../components/Label';

// ----------------------------------------------------------------------
const ROLE = {
  ASSISTANT: 2,
  USER: 3,
};

const USER_STATUS = {
  ACTIVE: 1,
  DE_ACTIVE: 2,
};

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function UserList() {
  const [tableData, setTableData] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getUsersData = async () => {
      if (isAuthenticated && user?.role !== 1) {
        return router.push('/appointment/list');
      }
      const { data } = await getUsers();
      setTableData(data);
    };

    getUsersData();
  }, []);

  const headLabel = [
    { id: 1, label: 'Họ và tên' },
    { id: 2, label: 'Email' },
    { id: 3, label: 'Số điện thoại' },
    { id: 5, label: 'Địa chỉ' },
    { id: 6, label: 'Trạng thái' },
    { id: 8, label: 'Role' },
    { id: 7, label: '' },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();

  const theme = useTheme();

  const handleActiveUser = async (id) => {
    await activeUser(id);
    const { data } = await getUsers();
    setTableData(data);
    enqueueSnackbar('Kích hoạt user thành công', { autoHideDuration: 3000 });
  };

  const handleDeactiveUser = async (id) => {
    await deActiveUser(id);
    const { data } = await getUsers();
    setTableData(data);
    enqueueSnackbar('Hủy kích hoạt user thành công', { autoHideDuration: 3000 });
  };

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography gutterBottom variant="h3">
          Quản lý user
        </Typography>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative', paddingTop: '8px' }}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    {headLabel.map((headCell) => (
                      <TableCell
                        key={`label-${headCell.id}`}
                        align={headCell.align || 'center'}
                        sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.phone}</TableCell>
                      <TableCell align="center">{row.address}</TableCell>
                      <TableCell align="center">
                        {row.status === USER_STATUS.ACTIVE ? (
                          <Label sx={{ width: '64px' }} color="primary">
                            Active
                          </Label>
                        ) : (
                          <Label sx={{ width: '64px' }} color="default">
                            Disable
                          </Label>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.role === ROLE.USER ? (
                          <Label sx={{ width: '64px' }} color="secondary">
                            User
                          </Label>
                        ) : (
                          <Label sx={{ width: '64px' }} color="info">
                            Assistant
                          </Label>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.status === USER_STATUS.ACTIVE ? (
                          <LoadingButton
                            loading={false}
                            size="small"
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={() => handleDeactiveUser(row.id)}
                            sx={{ backgroundColor: theme.palette.warning.dark, width: '80px' }}
                          >
                            Deactive
                          </LoadingButton>
                        ) : (
                          <LoadingButton
                            loading={false}
                            size="small"
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={() => handleActiveUser(row.id)}
                            sx={{ backgroundColor: theme.palette.primary.dark, width: '80px' }}
                          >
                            Active
                          </LoadingButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
