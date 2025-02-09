"use server";

import { verifyJwt } from "../global/jwt";
import DB from "../prisma";

export type PermType = {
  email: string;
  project: number[];
  projects: boolean;
  note: boolean;
  member: boolean;
  team: boolean;
};
/*
* perms type
  {
    users : string[] // emails
    perms : {
      email : string
      projects : bool
      project : string[] // uuids
    }[]
  }

*/
export type TeamType = {
  uuid: string;
  created: Date;
  name: string;
  avatar: string;
  perms: any;
  owner: {
    email: string;
    avatar: string;
  };
  projects: {
    uuid: string;
    name: string;
    avatar: string;
  }[];
  users: {
    _count: {
      teamMembers: number;
    };
  }[];
};

export async function getTeams({
  jwt,
}: {
  jwt: string;
}): Promise<{ data: TeamType[] }> {
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { data: [] };

  const data = await DB.teams.findMany({
    where: {
      users: {
        every: {
          id: vJwt.id,
        },
      },
    },
    select: {
      uuid: true,
      created: true,
      name: true,
      avatar: true,
      perms: true,
      owner: {
        select: {
          email: true,
          avatar: true,
        },
      },
      projects: {
        select: {
          uuid: true,
          name: true,
          avatar: true,
        },
      },
      users: {
        select: {
          _count: {
            select: {
              teamMembers: true,
            },
          },
        },
      },
    },
  });

  return { data: data };
}

export async function createTeam({
  jwt,
  name,
  avatar,
}: {
  jwt: string;
  name: string;
  avatar: string;
}): Promise<{ status: 200 | 201 }> {
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 };
  const create = await DB.teams.create({
    data: {
      name: name,
      avatar: avatar,
      owner_id: vJwt.id,
      perms: {},
      users: {
        connect: {
          id: vJwt.id,
        },
      },
    },
  });
  return { status: 200 };
}
