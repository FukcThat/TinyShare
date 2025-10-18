# TinyShare Roadmap

### Reservation and Booking System

[66%] Request a new booking by clicking start and end on the calander
-- [x] check that no reservations lie between those dates
-- [x] intuitively set start & end time by clicking the calendar
-- [later] && by setting start & end time by input
-- [later] Datetime picker library integration
-- [x] creating reservation
-- [x] Cancel Booking from requester view
[50%] Owners side of booking
-- [x] Accept/Deny Booking
-- [later] Update booking time
[x] Search/Filter Items by status and other things to find free items in your needed timeline
[x] Availablitiy functionality (when is not available, new bookings cannot be made but standing bookings are upheld)

#### Bug-Report:

[x] Letting owner of item cancel existing booking
[x] timeText passed on both first and last day of booking, fix it to only be one or the other
[x] edit item and new item form share state leading to weird behavior, fix this

### Admin System

#### Community CRUD

[] Create new Community
[] Update community Data
[] Delete Community

#### Membership System

[] Invite to community
[] accept invite
[] leave community
[] kick from community
[] update user role (member/admin)

### Deletion

[ ] think about deletion and how that will work exactly (who can do it, what happens to dependencies, other things to think about?)
-- [] deleting items
-- [] deleting users
-- [] deleting communities
-- [] deleting reservation
-- [] deleting membership
