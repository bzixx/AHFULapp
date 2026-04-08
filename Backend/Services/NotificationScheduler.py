import threading
import time
from firebase_admin import messaging

from Services.TaskDriver import TaskDriver
from Services.TokenDriver import TokenDriver

class NotificationScheduler:
    def __init__(self, interval_seconds=300):
        self.interval = interval_seconds
        self.running = False
        self.thread = None

    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._run, daemon=True)
            self.thread.start()
            print(f"Notification scheduler started, checking every {self.interval} seconds")

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join()
        print("Notification scheduler stopped")

    def _run(self):
        while self.running:
            try:
                self._check_and_send_notifications()
            except Exception as e:
                print(f"Error in notification scheduler: {e}")
            time.sleep(self.interval)

    def _check_and_send_notifications(self):
        tasks, error = TaskDriver.find_overdue_tasks()
        
        if error or not tasks:
            return
        
        sent_task_ids = set()
        
        for task in tasks:
            task_id = str(task.get("_id"))
            if task_id in sent_task_ids:
                continue
            
            user_id = task.get("user_id")
            if not user_id:
                continue
            
            task_name = task.get("name", "Task")
            
            tokens, token_error = TokenDriver.get_all_tokens_by_user(user_id)
            if token_error or not tokens:
                continue
            
            for token_doc in tokens:
                fcm_token = token_doc.get("token")
                if fcm_token:
                    self._send_notification(fcm_token, task_name, task_id)
            
            sent_task_ids.add(task_id)
        
        print(f"Notification scheduler: processed {len(sent_task_ids)} overdue tasks")

    def _send_notification(self, token, task_name, task_id):
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title="Task Reminder",
                    body=f"'{task_name}' is due now!"
                ),
                token=token,
                data={
                    "task_id": task_id,
                    "type": "task_reminder"
                }
            )
            response = messaging.send(message)
            print(f"Successfully sent notification for task {task_id}: {response}")
        except Exception as e:
            print(f"Error sending notification to {token[:20]}...: {e}")

notification_scheduler = NotificationScheduler(interval_seconds=300)

def start_scheduler():
    notification_scheduler.start()

def stop_scheduler():
    notification_scheduler.stop()
