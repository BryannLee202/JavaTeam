import { Navigate, createBrowserRouter, useParams } from "react-router-dom";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import { DEFAULT_TAB } from "@/pages/tabConfig";

// /coordinator/events/:eventId (no tab segment) → redirect to the default
// tab. Built as its own component (rather than a relative <Navigate to="...">)
// so the eventId segment is never accidentally dropped during resolution.
function DefaultTabRedirect() {
  const { eventId } = useParams<{ eventId: string }>();
  return <Navigate to={`/coordinator/events/${eventId}/${DEFAULT_TAB}`} replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/coordinator/events" replace /> },
  { path: "/coordinator/events", element: <EventsPage /> },
  { path: "/coordinator/events/:eventId", element: <DefaultTabRedirect /> },
  { path: "/coordinator/events/:eventId/:tab", element: <EventDetailPage /> },
]);
