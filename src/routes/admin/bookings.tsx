import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteBookingFn,
  listBookingsFn,
  updateBookingStatusFn,
  type Booking,
} from "@/lib/admin-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/bookings")({ component: BookingsPage });

const STATUSES = ["new", "contacted", "enrolled", "closed"];

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  async function load() {
    try {
      setBookings(await listBookingsFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load bookings");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(b: Booking, status: string) {
    try {
      await updateBookingStatusFn({ data: { id: b.id, status } });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function remove(b: Booking) {
    if (!window.confirm(`Delete booking from "${b.parent_name || b.name}"?`)) return;
    try {
      await deleteBookingFn({ data: { id: b.id } });
      toast.success("Booking deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Enrollment &amp; free trial requests from the website form
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {bookings === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No bookings yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.parent_name || b.name}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">{b.email || "—"}</div>
                      <div className="text-xs text-muted-foreground">{b.phone || "—"}</div>
                      <div className="text-xs text-muted-foreground">{b.country || "—"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{b.child_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">Age: {b.child_age || "—"}</div>
                      <div className="text-xs text-muted-foreground">Level: {b.current_level || "—"}</div>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="text-xs text-muted-foreground">Tutor: {b.tutor_gender || "—"}</p>
                      <p className="text-xs text-muted-foreground">Class time: {b.class_time || "—"}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(b.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <select
                        value={b.status}
                        onChange={(e) => setStatus(b, e.target.value)}
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="mt-1">
                        <Badge variant={b.status === "new" ? "default" : "outline"}>{b.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => remove(b)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
