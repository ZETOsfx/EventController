/* Поднятие базовых таблиц (со связями) + Стандартный профиль администратора */
const { PgLiteral } = require("node-pg-migrate");

exports.shorthands = undefined;

exports.up = (pgm) => {

    pgm.createExtension("uuid-ossp", {
        ifNotExists: true
    });

    /**
     * Транслируемые события в текущий момент
     */
    pgm.createTable('cast_events', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(50)',
            notNull: true,
        },
        src: {
            type: 'text',
            notNull: true,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
        },
        type: {
            type: 'integer',
            notNull: true,
        },
        time: {
            type: 'integer',
            notNull: true,
        },
        order: {
            type: 'integer',
            notNull: true,
        },
        screen: {
            type: 'integer',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    /**
     * Роли, профили пользователей
     */
    pgm.createTable('roles', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        role: {
            type: 'varchar(10)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });
    pgm.createTable('users', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(16)',
            unique: true,
            notNull: true,
        },
        role_id: {
            type: "uuid",
            notNull: true,
            references: '"roles" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        pass_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        login: {
            type: 'varchar(20)',
            notNull: true,
        },
        email: {
            type: 'varchar(100)',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    /**
     * События для подписок
     */
    pgm.createTable('subscribes', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(30)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    })
    pgm.createTable('user_subscribe', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        user_id: {
            type: "uuid",
            notNull: true,
            references: '"users" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        subscribe_id: {
            type: "uuid",
            notNull: true,
            references: '"subscribes" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    /**
     * Работа по настройке трансляции
     */
    pgm.createTable('composes', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(30)',
            notNull: true,
        },
        comment: {
            type: 'text',
            notNull: false,
        },
        date: {
            type: 'varchar(10)',
            notNull: true,
        },
        is_special: {
            type: 'boolean',
            notNull: true,
        },
        author: {
            type: 'varchar(16)',
            notNull: true,
            references: '"users" (name)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        screen: {
            type: 'integer',
            notNull: false,
        },
        status: {
            type: 'varchar(10)',
            notNull: false,
        },
        message: {
            type: 'text',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });
    pgm.createTable('programs', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(30)',
            notNull: true,
        },
        author: {
            type: 'varchar(16)',
            notNull: true,
            references: '"users" (name)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        compose_id: {
            type: "uuid",
            notNull: false,
            references: '"composes" (id)',
            onDelete: 'set null',
            onUpdate: 'cascade',
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        time_to_swap: {
            type: 'time',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });
    pgm.createTable('events', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(50)',
            notNull: true,
        },
        src: {
            type: 'text',
            notNull: true,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
        },
        type: {
            type: 'varchar(7)',
            notNull: true,
        },
        time: {
            type: 'integer',
            notNull: true,
        },
        order: {
            type: 'integer',
            notNull: true,
        },
        program_id: {
            type: "uuid",
            notNull: true,
            references: '"programs" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });
    pgm.createTable('requests', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        compose_id: {
            type: "uuid",
            notNull: true,
            references: '"composes" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        is_accepted: {
            type: 'boolean',
            notNull: true,
        },
        approved: {
            type: 'varchar(16)',
            notNull: false,
        },
        changer: {
            type: 'varchar(16)',
            notNull: false,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
        },
        in_processing: {
            type: 'boolean',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    /**
     * Уведомления и данные о прочтении
     */
    pgm.createTable('notes', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        comment: {
            type: 'text',
            notNull: false,
        },
        expires: {
            type: 'varchar(10)',
            notNull: true,
        },
        author: {
            type: 'varchar(16)',
            notNull: true,
            references: '"users" (name)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        on_broadcast: {
            type: 'boolean',
            notNull: true,
        },
        addressed_to: {
            type: 'varchar(20)',
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });
    pgm.createTable('user_note', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        user_id: {
            type: "uuid",
            notNull: true,
            references: '"users" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        note_id: {
            type: "uuid",
            notNull: true,
            references: '"notes" (id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    /**
     * Данные файлов
     */
    pgm.createTable('files', {
        id: {
            type: "uuid",
            default: new PgLiteral("uuid_generate_v4()"),
            notNull: true,
            primaryKey: true
        },
        name: {
            type: 'text',
            notNull: true,
        },
        src: {
            type: 'text',
            notNull: true,
        },
        type: {
            type: 'varchar(5)',
            notNull: true,
        },
        weight: {
            type: 'varchar(10)',
            notNull: true,
        },
        author: {
            type: 'varchar(16)',
            notNull: true,
            references: '"users" (name)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        expires: {
            type: 'date',
            notNull: false,
        },
        is_unlimited: {
            type: 'boolean',
            notNull: true,
        },
        format: {
            type: 'varchar(6)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    pgm.sql(`INSERT INTO roles (role) VALUES ('admin');`);
    pgm.sql(`INSERT INTO roles (role) VALUES ('moderator');`);
    pgm.sql(`INSERT INTO roles (role) VALUES ('manager');`);
    pgm.sql(`INSERT INTO roles (role) VALUES ('editor');`);

    /**
     * Default user:
     * Login: admin
     * Password: 1
     */
    pgm.sql(`INSERT INTO users (name, role_id, pass_hash, login) VALUES (
        'System', 
        (SELECT id FROM roles WHERE role = 'admin'), 
        '$argon2id$v=19$m=65536,t=3,p=4$UiEDINhI5e0tQ9CN9uQRPA$51V+HYjZ6u5O0T5ZcxdYGLBATOhu8XMpvOVvZhG4jzc', 
        'admin'
    );`);
};

exports.down = (pgm) => {
    pgm.dropTable('cast_events');
    pgm.dropTable('files');
    pgm.dropTable('user_note');
    pgm.dropTable('notes');
    pgm.dropTable('requests');
    pgm.dropTable('events');
    pgm.dropTable('programs');
    pgm.dropTable('composes');
    pgm.dropTable('user_subscribe');
    pgm.dropTable('subscribes');
    pgm.dropTable('users');
    pgm.dropTable('roles');

    pgm.dropExtension("uuid-ossp");
};
