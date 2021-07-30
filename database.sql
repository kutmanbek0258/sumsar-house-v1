create table users (
    _id serial primary key ,
    name varchar (200) not null ,
    email varchar (200) not null unique,
    phone varchar (100) not null unique,
    fast boolean default true,
    hashed_password varchar (300) not null,
    created_at timestamp default now()
);

create table categories (
    _id serial primary key ,
    name varchar (200),
    description varchar (1000),
    created_at timestamp default now()
);

create table houses (
    _id serial primary key ,
    address varchar (200),
    description varchar (2000),
    phone varchar (100),
    price numeric,
    latitude double precision,
    longitude double precision,
    _user integer,
    category integer,
    created_at timestamp default now(),

    foreign key (_user) references users (_id),
    foreign key (category) references categories (_id)
);

create table favorites (
    _id serial primary key ,
    _user integer,
    house integer,
    created_at timestamp default now(),

    foreign key (_user) references users (_id),
    foreign key (house) references houses (_id)
);

create table histories (
    _id serial primary key ,
    _user integer,
    house integer,
    created_at timestamp default now(),

    foreign key (_user) references users (_id),
    foreign key (house) references houses (_id)
);

create table faqs (
    _id serial primary key ,
    title varchar (500) not null ,
    content varchar (2000) not null ,
    contacts varchar (200) not null ,
    link varchar (1000),
    created_at timestamp default now()
);

create table banners (
    _id serial primary key ,
    description varchar (2000) not null ,
    link varchar (1000),
    latitude double precision,
    longitude double precision,
    created_at timestamp default now()
);



