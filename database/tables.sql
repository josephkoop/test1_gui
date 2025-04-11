-- tables.sql

drop table if exists tasks;

create table tasks (
    id serial primary key,
    title varchar(100) not null,
    description text,
    priority integer not null,
    completed boolean not null default false,
    created_at timestamp with time zone default now()
);

insert into tasks (title, description, priority, completed)
values
    ('Planning', null, 3, true),
    ('Analysis', 'Gather data', 3, true),
    ('Design', 'Design database, front-end, and middeware', 3, false),
    ('Coding-1', 'Front End', 3, true),
    ('Coding-2', 'Database', 3, false),
    ('Coding-3', 'Middleware', 3, false),
    ('Testing', null, 3, true),
    ('Documentation', 'Write documentation', 3, false);