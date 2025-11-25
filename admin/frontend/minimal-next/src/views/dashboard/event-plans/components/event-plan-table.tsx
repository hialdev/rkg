'use client';

import * as React from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useBoolean } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { TableNoData } from 'src/components/table/table-no-data';
import { TableHeadCustom, type TableHeadCellProps } from 'src/components/table/table-head-custom';
import { TableSelectedAction } from 'src/components/table/table-selected-action';
import { emptyRows } from 'src/components/table/utils';
import { Scrollbar } from 'src/components/scrollbar';
import { EventPlanTableRow } from './event-plan-table-row';


// ----------------------------------------------------------------------

type Props = {
  eventPlans: any[];
  onEdit: (eventPlan: any) => void;
  onDelete: () => void;
  editHref: (id: string) => string;
};

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'step_order', label: 'Step Order', align: 'left' },
  { id: 'subtitle', label: 'Subtitle', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

export function EventPlanTable({ eventPlans, onEdit, onDelete, editHref }: Props) {
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState('title');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');

  const dense = useBoolean();

  const dataFiltered = eventPlans.sort(getComparator(order, orderBy));

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense.value ? 56 : 76;

  const selectedAll = selected.length === dataInPage.length;
  const selectedSome = selected.length > 0 && selected.length < dataInPage.length;

  const handleSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelecteds = dataFiltered.map((n) => n.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = eventPlans.filter((item) => item.id !== id);
    // In a real app, you would call a delete API endpoint here
    onDelete();
  };

  const handleDeleteSelected = () => {
    const deleteRows = eventPlans.filter((item) => !selected.includes(item.id));
    // In a real app, you would call a delete API endpoint for selected items
    setSelected([]);
    onDelete();
  };

  return (
    <Card>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={dense.value}
          numSelected={selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={handleSelectAll}
          action={
            <Button
              color="error"
              size="small"
              onClick={handleDeleteSelected}
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Delete all
            </Button>
          }
        />

        <Scrollbar>
          <Table size={dense.value ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headCells={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              onSort={handleSort}
              onSelectAllRows={handleSelectAll}
            />

            <TableBody>
              {dataInPage.map((row) => (
                <EventPlanTableRow
                  key={row.id}
                  row={row}
                  selected={selected.includes(row.id)}
                  onSelectRow={() => handleSelectRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  onSuccessEdit={() => onEdit}
                  editHref={editHref(row.id)}
                />
              ))}

              <TableNoData
                notFound={dataFiltered.length === 0}
                sx={{ height: denseHeight * (rowsPerPage + 1) }}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        page={page}
        component="div"
        count={dataFiltered.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function getComparator(order: 'asc' | 'desc', orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => b[orderBy] - a[orderBy]
    : (a: any, b: any) => a[orderBy] - b[orderBy];
}
