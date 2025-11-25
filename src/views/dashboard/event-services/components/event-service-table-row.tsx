import type { EventServiceData } from 'src/stores/event-service';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'minimal-shared/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import useEventServiceStore from 'src/stores/event-service';

// ----------------------------------------------------------------------

type Props = {
  row: EventServiceData;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onSuccessEdit: () => void;
  editHref: string;
};

export function EventServiceTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onSuccessEdit,
  editHref,
}: Props) {
 const { id, title, description, image } = row;

 const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const confirmDialog = useBoolean();

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpen(null);
  };

  const handleDelete = async () => {
    try {
      if (id) {
        const { delete: deleteEventService } = useEventServiceStore.getState();
        const response = await deleteEventService({ id });
        
        if (response.success) {
          toast.success(response.message || 'Event service deleted successfully!');
          onDeleteRow();
        } else {
          toast.error(response.message || 'Failed to delete event service');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('There was an error deleting the event service!');
    } finally {
      confirmDialog.onFalse();
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box gap={2} display="flex" alignItems="center">
            {image && (
              <Box
                component="img"
                src={typeof image === 'string' ? (image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_HOST}/${image}`) : URL.createObjectURL(image)}
                sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0 }}
              />
            )}
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography noWrap maxWidth={300} variant="body2">
            {description}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ py: 1 }}>
          <Link href={editHref} underline="none">
            <Box
              onClick={handleClosePopover}
              sx={{
                py: 1.5,
                px: 2,
                typography: 'body2',
                display: 'flex',
                gap: 1,
                cursor: 'pointer',
                alignItems: 'center',
              }}
            >
              <Iconify icon="solar:pen-bold" width={20} />
              Edit
            </Box>
          </Link>

          <Box
            onClick={() => {
              confirmDialog.onTrue();
              handleClosePopover();
            }}
            sx={{
              py: 1.5,
              px: 2,
              typography: 'body2',
              display: 'flex',
              gap: 1,
              cursor: 'pointer',
              alignItems: 'center',
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={20} />
            Delete
          </Box>
        </Box>
      </Popover>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        }
      />
    </>
  );
}
