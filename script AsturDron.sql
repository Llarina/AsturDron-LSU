create database asturDron;
use asturDron;
create table users(
	id int auto_increment primary key,
    username varchar(50) unique not null,
    user_email varchar(50) unique not null,
    password varchar(50) not null,
    score int not null,
    type varchar(3) not null check(type in ('a1','a2','a3','any'))
);
create table if not exists regulations(
	id int primary key,
    title varchar(150),
    content varchar(2000),
    type varchar(3) not null check(type in ('a1','a2','a3','any')),
    created_at timestamp default now()
);
select * from users;       