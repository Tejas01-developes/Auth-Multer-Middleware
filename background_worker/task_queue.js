import bull from 'bull';

export const queue=new bull(
    "task-queue",
    "redis://127.0.0.1:6379"
)