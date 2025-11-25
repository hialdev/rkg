'use client';

import type { TripData } from 'src/stores/trip';
import type { ITripTableFilters } from 'src/types/trip';
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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/al/paths';

import useTripStore from 'src/stores/trip';
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

import { TripTableRow } from '../components/trip-table-row';
import { TripTableToolbar } from '../components/trip-table-toolbar';
import { TripTableFiltersResult } from '../components/trip-table-filters-result';
import { Link } from '@mui/material';
import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
   { id: 'title', label: 'Trip' },
   { id: 'type', label: 'Type' },
   { id: 'country', label: 'Country' },
   { id: 'duration', label: 'Duration' },
   { id: 'price', label: 'Price' },
   { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function TripListView() {
   const table = useTable();
   const confirmDialog = useBoolean();
   const addDialog = useBoolean();
   const { all, delete: destroy } = useTripStore();

   const [tableData, setTableData] = useState<TripData[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   const [pagination, setPagination] = useState({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
   });

   const filters = useSetState<ITripTableFilters>({ title: '', type: [], country: [] });
   const { state: currentFilters, setState: updateFilters } = filters;

   const fetchData = async () => {
      setLoading(true);

      const params = {
         page: table.page + 1,
         limit: table.rowsPerPage,
         sort: table.orderBy,
         order: table.order,
         search: currentFilters.title || '',
         type: currentFilters.type.join(',') || '',
         country: currentFilters.country.join(',') || '',
      };

      try {
         const res = await all(params);

         if (res.success) {
            const { pagination: pgnt, trips } = res.data;
            setTableData(trips || []);
            setPagination({
               page: pgnt.page,
               limit: pgnt.limit,
               total: pgnt.total,
               totalPages: pgnt.totalPages,
            });
         } else {
            toast.error('Gagal memuat data trip');
         }
      } catch (error) {
         toast.error('Gagal memuat data trip');
         console.error('Error fetching trips:', error);
      }

      setLoading(false);
   };

   useEffect(() => {
      fetchData();
   }, []);

   const [debouncedSearch] = useDebounce(currentFilters.title, 500);

   useEffect(() => {
      fetchData();
   }, [
      table.page,
      table.rowsPerPage,
      table.orderBy,
      debouncedSearch,
      currentFilters.type,
      currentFilters.country,
   ]);

   const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters: currentFilters,
   }) as TripData[];

   const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

   const canReset =
      !!currentFilters.title || currentFilters.type.length > 0 || currentFilters.country.length > 0;

   const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

   const handleDeleteRow = useCallback(
      async (id: string) => {
         try {
            const reqdel = await destroy({ id });
            if (reqdel.success) {
               toast.success(reqdel.message);
            }
         } catch (error: any) {
            toast.error('Gagal menghapus data');
         }
         fetchData();
         table.onUpdatePageDeleteRow(dataInPage.length);
      },
      [dataInPage.length, table, tableData, destroy, fetchData]
   );

   const handleDeleteRows = useCallback(async () => {
      if (table.selected.length === 0) {
         toast.info('Tidak ada data yang dipilih!');
         return;
      }

      try {
         // Loop hapus satu per satu
         for (const id of table.selected) {
            try {
               const reqdel = await destroy({ id });
               if (reqdel.success) {
                  toast.success(reqdel.message || `Berhasil hapus trip dengan ID: ${id}`);
               } else {
                  toast.error(reqdel.message || `Gagal hapus trip dengan ID: ${id}`);
               }
            } catch (error) {
               toast.error(`Gagal hapus trip dengan ID: ${id}`);
            }
         }

         fetchData();
         table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
      } catch (error) {
         toast.error('Terjadi kesalahan saat menghapus data!');
      }
   }, [table, dataInPage.length, dataFiltered.length, destroy, fetchData]);

   // ----------------------------------------------------------------------------------------------------------

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
               heading="Trips"
               links={[
                  { name: 'Dashboard', href: paths.dashboard.root },
                  { name: 'Trip', href: paths.dashboard.trip.root },
                  { name: 'List' },
               ]}
               action={
                  <Button
                     onClick={() => redirect(paths.dashboard.trip.create)}
                     variant="contained"
                     startIcon={<Iconify icon="mingcute:add-line" />}
                  >
                     Add trip
                  </Button>
               }
               sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
               <TripTableToolbar
                  filters={filters}
                  onResetPage={table.onResetPage}
                  options={{
                     countries: [
                        ...new Set(
                           tableData.map((trip) => trip.country).filter(Boolean) as string[]
                        ),
                     ].filter(Boolean) as string[],
                     types: ['open-trip', 'private-trip'],
                  }}
               />

               {canReset && (
                  <TripTableFiltersResult
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
                              dataFiltered
                                 .map((row) => row.id)
                                 .filter((id): id is string => id !== undefined)
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
                                    dataFiltered
                                       .map((row) => row.id)
                                       .filter((id): id is string => id !== undefined)
                                 )
                              }
                           />

                           <TableBody>
                              {dataFiltered.map((row) => (
                                 <TripTableRow
                                    onSuccessEdit={() => fetchData()}
                                    key={row.id}
                                    row={row}
                                    selected={table.selected.includes(row.id ? row.id : '')}
                                    onSelectRow={() => table.onSelectRow(row.id ? row.id : '')}
                                    onDeleteRow={() => handleDeleteRow(row.id ? row.id : '')}
                                    editHref={
                                       row.id ? paths.dashboard.trip.update + '/' + row.id : ''
                                    }
                                 />
                              ))}

                              {!loading && dataFiltered.length < 0 && (
                                 <TableEmptyRows
                                    height={table.dense ? 56 : 76}
                                    emptyRows={emptyRows(
                                       table.page,
                                       table.rowsPerPage,
                                       dataFiltered.length
                                    )}
                                 />
                              )}

                              {pagination.totalPages === 0 && <TableNoData notFound={notFound} />}
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
      </>
   );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
   inputData: TripData[];
   filters: ITripTableFilters;
   comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
   const { title, type, country } = filters;

   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

   stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
   });

   inputData = stabilizedThis.map((el) => el[0]);

   if (title) {
      inputData = inputData.filter(
         (trip) =>
            (trip.title ?? '').toLowerCase().includes(title.toLowerCase()) ||
            (trip.description ?? '').toLowerCase().includes(title.toLowerCase())
      );
   }

   if (type.length) {
      inputData = inputData.filter((trip) => type.includes(trip.type ?? ''));
   }

   if (country.length) {
      inputData = inputData.filter((trip) => country.includes(trip.country ?? ''));
   }

   return inputData;
}
