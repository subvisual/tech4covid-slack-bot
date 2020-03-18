cat daily_reminders.csv | tail -n +2 | xargs -L1 ./bin/daily_reminder.sh

