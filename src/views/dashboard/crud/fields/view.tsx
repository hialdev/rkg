"use client"

import type { TableData } from "src/stores/table";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@mui/material";

import { paths } from "src/routes/al/paths";

import useTabletore from "src/stores/table";
import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { LoadingScreen } from "src/components/loading-screen";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

export default function FieldView() {
   const params = useParams();
   const id = params.id?.toString();
   const [table, setTable] = useState<TableData>();
   const { detail } = useTabletore();

   const fetch = async () => {
      const res = await detail({ id: id ?? '' })
      if (res.success) {
         setTable(res.data)
      } else {
         toast.error(res.message)
      }
   }

   useEffect(() => {
      fetch()
   }, [])

   if (!table) return <LoadingScreen />

   return (
      <DashboardContent>
         <CustomBreadcrumbs
            heading="Dataset Management"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Dataset Management', href: paths.dashboard.crud.root },
               { name: 'Setting Field of Table Dataset : '+table?.name },
            ]}
            action={
               <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
               >
                  Add Field
               </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
         />
         

      </DashboardContent>
   )
}