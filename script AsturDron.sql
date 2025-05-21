use asturDron;
create table users(
	id int auto_increment unique,
    username varchar(50) not null primary key,
    user_email varchar(50) unique not null,
    password varchar(100) not null,
    license varchar(3) not null check(license in ('a1','a2','a3','any')),
    score int not null
);
create table if not exists notices(
	id int primary key,
    miniature varchar(1500) not null,
    title varchar(150),
    notice varchar(2000),
    license varchar(3) not null check(type in ('a1','a2','a3','any')),
    dateYear timestamp default now()
);
create table if not exists images(
	id int auto_increment primary key,
    username  varchar(50) unique not null,
    image varchar (1500)
);
create table if not exists videos(
	id int auto_increment primary key,
    miniuature varchar(1500),
    username  varchar(50) unique not null,
    video varchar (1500)
);
create table if not exists weather(
	id int auto_increment primary key,
    week_day  varchar(15) unique not null,
    numberDay int,
    weather varchar(50)
    
);
select * from users;       