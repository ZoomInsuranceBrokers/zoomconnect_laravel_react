
## Project Setup
- To run the default Laravel migrations and delete existing tables, run the command `php artisan migrate`.

- Drp the table role_master.
# zoomconnect_laravel_react


ALTER TABLE policy_master
    ADD COLUMN is_paperless TINYINT(1) NOT NULL DEFAULT 1 AFTER policy_document,
    ADD COLUMN doc_courier_name VARCHAR(255) NULL AFTER is_paperless,
    ADD COLUMN doc_courier_address VARCHAR(255) NULL AFTER doc_courier_name;
