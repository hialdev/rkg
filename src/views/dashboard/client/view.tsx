'use client';

import type { ClientData } from 'src/stores/client';
import type { IClientTableFilters } from 'src/views/dashboard/client/components/client-table-toolbar';
import type { TableHeadCellProps } from 'src/components/table';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useDebounce, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import useClientStore from 'src/stores/client';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
   useTable,
   emptyRows,
   rowInPage,
   TableNoData,
   getComparator,
   TableEmptyRows,
   TableHeadCustom,
   TableSelectedAction,
   TablePaginationCustom,
} from 'src/components/table';

import { ClientCUForm } from './forms/client-cu-form';
import { ClientTableRow } from './components/client-table-row';
import { ClientTableToolbar } from './components/client-table-toolbar';
import { ClientTableFiltersResult } from './components/client-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
   { id: 'title', label: 'Title' },
   { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ClientListView() {
   const table = useTable();
   const confirmDialog = useBoolean();
   const addDialog = useBoolean();
   const { all, delete: destroy } = useClientStore();

   const [tableData, setTableData] = useState<ClientData[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   const [pagination, setPagination] = useState({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
   });

   const filters = useSetState<IClientTableFilters>({ name: '' });
   const { state: currentFilters, setState: updateFilters } = filters;

   const fetchData = async () => {
      setLoading(true);

      const params = {
         page: table.page + 1,
         limit: table.rowsPerPage, // minimal 25
         sort: table.orderBy,
         order: table.order,
         search: currentFilters.name || '',
      };

      const res = await all(params);

      if (res.success) {
         const { pagination: pgnt, clients } = res.data;
         setTableData(clients || []);
         setPagination({
            page: pgnt.page,
            limit: pgnt.limit,
            total: pgnt.total,
            totalPages: pgnt.totalPages,
         });
      } else {
         toast.error('Gagal memuat data client');
      }

      setLoading(false);
   };

   const [debouncedSearch] = useDebounce(currentFilters.name, 500);

   useEffect(() => {
      fetchData();
   }, [
      table.page,
      table.rowsPerPage,
      table.order,
      table.orderBy,
      debouncedSearch,
   ]);

   const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters: currentFilters,
   });

   const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

   const canReset = !!currentFilters.name;

   const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

   const handleDeleteRow = useCallback(
      async (id: string) => {
         try {
            const reqdel = await destroy({ id });
            if (reqdel.success) {
               toast.success(reqdel.message);
            }
         } catch (error: any) {
            toast.error("Gagal menghapus data");
         }
         fetchData();
         table.onUpdatePageDeleteRow(dataInPage.length);
      },
      [dataInPage.length, table, tableData]
   );

   const handleDeleteRows = useCallback(async () => {
      if (table.selected.length === 0) {
         toast.info("Tidak ada data yang dipilih!");
         return;
      }

      try {
         // Loop hapus satu per satu
         for (const id of table.selected) {
            try {
               const reqdel = await destroy({ id });
               if (reqdel.success) {
                  toast.success(reqdel.message || `Berhasil hapus client dengan ID: ${id}`);
               } else {
                  toast.error(reqdel.message || `Gagal hapus client dengan ID: ${id}`);
               }
            } catch (error) {
               toast.error(`Gagal hapus client dengan ID: ${id}`);
            }
         }

         fetchData();
         table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
      } catch (error) {
         toast.error("Terjadi kesalahan saat menghapus data!");
      }
   }, [table, dataInPage.length, dataFiltered.length]);

   // ----------------------------------------------------------------------------------------------------------
   const renderFormAdd = () => (
      <ClientCUForm
         open={addDialog.value}
         onSuccess={() => fetchData()}
         onClose={addDialog.onFalse}
      />
   );

   const renderConfirmDialog = () => (
      <ConfirmDialog
         open={confirmDialog.value}
         onClose={confirmDialog.onFalse}
         title="Delete"
         content={
            <>
               Are you sure want to delete <strong> {table.selected.length} </strong> items?
            </>
         }
         action={
            <Button
               variant="contained"
               color="error"
               onClick={() => {
                  handleDeleteRows();
                  confirmDialog.onFalse();
               }}
            >
               Delete
            </Button>
         }
      />
   );

   return (
      <>
         <DashboardContent>
            <CustomBreadcrumbs
               heading="Clients"
                  links={[
                     { name: 'Dashboard', href: '#' },
                     { name: 'Client', href: '#' },
                     { name: 'List' },
                  ]}
               action={
                  <Button
                     onClick={addDialog.onTrue}
                     variant="contained"
                     startIcon={<Iconify icon="mingcute:add-line" />}
                  >
                     Add client
                  </Button>
               }
               sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
               <ClientTableToolbar
                  filters={filters}
                  onResetPage={table.onResetPage}
                  options={{ roles: [] }}
               />

               {canReset && (
                  <ClientTableFiltersResult
                     filters={filters}
                     totalResults={dataFiltered.length}
                     onResetPage={table.onResetPage}
                     sx={{ p: 2.5, pt: 0 }}
                  />
               )}

               {loading ? (
                  <LoadingScreen />
               ) : (
                  <Box sx={{ position: 'relative' }}>
                     <TableSelectedAction
                        dense={table.dense}
                        numSelected={table.selected.length}
                        rowCount={dataFiltered.length}
                        onSelectAllRows={(checked) =>
                           table.onSelectAllRows(
                              checked,
                              dataFiltered.map((row) => row.id).filter((id): id is string => id !== undefined)
                           )
                        }
                        action={
                           <Tooltip title="Delete">
                              <IconButton color="primary" onClick={confirmDialog.onTrue}>
                                 <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                           </Tooltip>
                        }
                     />

                     <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                           <TableHeadCustom
                              order={table.order}
                              orderBy={table.orderBy}
                              headCells={TABLE_HEAD}
                              rowCount={dataFiltered.length}
                              numSelected={table.selected.length}
                              onSort={table.onSort}
                              onSelectAllRows={(checked) =>
                                 table.onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row) => row.id).filter((id): id is string => id !== undefined)
                                 )
                              }
                           />

                           <TableBody>
                              {dataFiltered.map((row) => (
                                 <ClientTableRow
                                    onSuccessEdit={() => fetchData()}
                                    key={row?.id ?? ''}
                                    row={row}
                                    selected={table.selected.includes(row?.id ?? '')}
                                    onSelectRow={() => table.onSelectRow(row?.id ?? '')}
                                    onDeleteRow={() => handleDeleteRow(row?.id ?? '')}
                                 />
                              ))}

                              {!loading && dataFiltered.length < 0 && (
                                 <TableEmptyRows
                                    height={table.dense ? 56 : 76}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                 />
                              )}

                              {pagination.totalPages === 0 && (
                                 <TableNoData notFound={notFound} />
                              )}

                           </TableBody>
                        </Table>
                     </Scrollbar>
                  </Box>
               )}

               <TablePaginationCustom
                  page={pagination.page - 1} // backend 1-based, MUI 0-based
                  dense={table.dense}
                  count={pagination.total}
                  rowsPerPage={pagination.limit}
                  onPageChange={(e, newPage) => {
                     table.onChangePage(e, newPage);
                     fetchData(); // ambil ulang data saat ganti halaman
                  }}
                  onRowsPerPageChange={(e) => {
                     const newLimit = parseInt(e.target.value, 10);
                     table.onChangeRowsPerPage(e as any);
                     setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 })); // reset ke page 1
                     table.onResetPage(); // pastikan ke halaman pertama
                     fetchData(); // ambil ulang data dengan limit baru
                  }}
                  onChangeDense={table.onChangeDense}
                  labelDisplayedRows={({ from, to }) =>
                     `${pagination.page} of ${pagination.totalPages} (${from}-${to} of ${pagination.total})`
                  }
               />

            </Card>
         </DashboardContent>

         {renderConfirmDialog()}
         {renderFormAdd()}
      </>
   );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
   inputData: ClientData[];
   filters: IClientTableFilters;
   comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
   const { name } = filters;

   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

   stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
   });

   inputData = stabilizedThis.map((el) => el[0]);

   if (name) {
      inputData = inputData.filter((client) => (client.title || '').toLowerCase().includes(name.toLowerCase()));
   }

   return inputData;
}
