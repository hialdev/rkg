import * as React from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'minimal-shared/hooks';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable } from 'src/components/table/use-table';
import { TableNoData } from 'src/components/table/table-no-data';
import { TableHeadCellProps, TableHeadCustom } from 'src/components/table/table-head-custom';
import { TableSelectedAction } from 'src/components/table/table-selected-action';
import { FaqTableRow } from './faq-table-row';
import { TablePaginationCustom } from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'title', label: 'FAQ', align: 'left' },
  { id: 'content', label: 'Content', align: 'left' },
  { id: '', width: 88 },
];

type Props = {
  tableData: any[];
  onDeleteRow: (id: string) => void;
  onEditRow: (id: string) => void;
  onViewRow: (id: string) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: 'asc' | 'desc';
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
};

export function FaqTable({ 
  tableData, 
  onDeleteRow, 
  onEditRow, 
  onViewRow,
 page,
  setPage,
  rowsPerPage,
 setRowsPerPage,
 totalItems,
  sortBy,
  setSortBy,
 sortOrder,
 setSortOrder
}: Props) {
  const table = useTable();

  const confirm = useBoolean();

  const [selectedId, setSelectedId] = React.useState('');

  const handleDelete = async () => {
    try {
      if (selectedId) {
        await onDeleteRow(selectedId);
        table.onResetPage();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const denseHeight = table.dense ? 56 : 76;

  return (
    <>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(checked, tableData.map((faq) => faq.id))
            }
            action={
              <Button
                color="error"
                size="small"
                variant="outlined"
                onClick={() => {}}
                startIcon={<i className="fa-solid fa-trash-can"></i>}
              >
                Delete all
              </Button>
            }
          />

          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData.map((faq) => faq.id))
              }
            />

            <TableBody>
              {tableData.map((faq) => (
                <FaqTableRow
                  key={faq.id}
                  row={faq}
                  selected={table.selected.includes(faq.id)}
                  onSelectRow={() => table.onSelectRow(faq.id)}
                  onDeleteRow={() => onDeleteRow(faq.id)}
                  editHref={`/dashboard/faqs/${faq.id}/edit`}
                />
              ))}

              <TableNoData
                notFound={!tableData?.length}
                sx={{ height: denseHeight * (table.rowsPerPage + 1) }}
              />
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={tableData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
