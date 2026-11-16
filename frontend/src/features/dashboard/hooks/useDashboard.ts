import { useMemo } from "react";
import { useTasks } from "../../tasks/hooks/useTask";
import { getDeadlineState } from "../../../shared/repository/tasks/deadline";

import type { DashboardTaskWithPriority, TaskPriority } from "../types/type";

export const useDashboard = () => {
  const { tasks, courses, loading, loadError, loadTasks } = useTasks();

  const tasksWithPriority = useMemo<DashboardTaskWithPriority[]>(() => {
    return tasks.map((task) => {
      const state = getDeadlineState(task);
      return { ...task, priority: state === "belum" ? "normal" : state };
    });
  }, [tasks]);

  const summary = useMemo(() => {
    const totalTasks = tasksWithPriority.length;

    const completed = tasksWithPriority.filter(
      (task) => task.status === "selesai",
    ).length;

    const urgent = tasksWithPriority.filter(
      (task) => task.priority === "mendesak",
    ).length;

    const overdue = tasksWithPriority.filter(
      (task) => task.priority === "terlambat",
    ).length;

    return {
      totalCourses: courses.length,
      totalTasks,
      completed,
      pending: totalTasks - completed,
      urgent,
      overdue,
      completionRate:
        totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100),
    };
  }, [tasksWithPriority, courses]);

  const priorityTasks = useMemo(() => {
    const order: Record<TaskPriority, number> = {
      mendesak: 0,
      terlambat: 1,
      normal: 2,
      selesai: 3,
    };

    return tasksWithPriority
      .filter(
        (task) => task.priority === "mendesak" || task.priority === "terlambat",
      )
      .sort((a, b) => {
        const priorityDiff = order[a.priority] - order[b.priority];

        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      })
      .slice(0, 5);
  }, [tasksWithPriority]);

  const recentTasks = useMemo(() => {
    return [...tasksWithPriority]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [tasksWithPriority]);

  return {
    loading,
    loadError,
    loadTasks,
    summary,
    priorityTasks,
    recentTasks,
  };
};
