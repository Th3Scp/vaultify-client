"use server";

import CheckPerm from "../global/checkPerm";
import { verifyJwt } from "../global/jwt";
import DB from "../prisma";
import { PermType } from "./team";

export type ProjectSettingData = {
  created: Date;
  name: string;
  avatar: string;
  deleted: boolean;
  finished: boolean;
  tasks: {
    color: string;
    created: Date;
    finished: boolean;
    title: string;
    uuid: string;
    description: string;
    checked_users: {
      email: string;
      avatar: string;
    }[];
    asUsers: {
      email: string;
      avatar: string;
    }[];
    _count: {
      sub_tasks: number;
    };
  }[];
};

export async function getProjectSetting({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<{ status: 201 } | { status: 200; data: ProjectSettingData }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Fetch user data
  const user = await DB.users.findUnique({ where: { id: vJwt.id } });
  if (!user) return { status: 201 }; // If user is not found, return failure status

  const project = await DB.projects.findUnique({
    where: {
      uuid: uuid,
      team: {
        users: {
          some: {
            email: user.email,
          },
        },
      },
    },
    select: {
      team: {
        select: {
          uuid: true,
        },
      },
      avatar: true,
      name: true,
      created: true,
      deleted: true,
      finished: true,
      tasks: {
        select: {
          color: true,
          created: true,
          finished: true,
          title: true,
          uuid: true,
          description: true,
          checked_users: {
            select: {
              email: true,
              avatar: true,
            },
          },
          asUsers: {
            select: {
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              sub_tasks: true,
            },
          },
        },
      },
    },
  });

  if (!project) return { status: 201 };

  const team = await DB.teams.findUnique({
    where: {
      uuid: project.team.uuid,
    },
    select: {
      owner_id: true,
      perms: true,
    },
  });

  if (!team) return { status: 201 };
  if (
    team.owner_id !== user.id &&
    !CheckPerm(team.perms as PermType, user.email, uuid)
  )
    return { status: 201 };

  return { status: 200, data: project };
}

export async function deleteProject({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<{ status: 201 | 200 }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Fetch user data
  const user = await DB.users.findUnique({ where: { id: vJwt.id } });
  if (!user) return { status: 201 }; // If user is not found, return failure status

  const project = await DB.projects.findUnique({
    where: {
      uuid: uuid,
      team: {
        owner: {
          id: user.id,
        },
      },
    },
  });

  if (!project) return { status: 201 };

  const res = await DB.projects.delete({
    where: { uuid: uuid },
    include: {
      asUsers: true,
      projectNote: true,
      sub_tasks: true,
      tasks: true,
    },
  });

  if (!res) return { status: 201 };

  return { status: 200 };
}
