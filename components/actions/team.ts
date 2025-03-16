"use server";

import { userAgent } from "next/server";
import CheckPerm, { CheckPermBE } from "../global/checkPerm";
import { verifyJwt } from "../global/jwt";
import DB from "../prisma";
import { avatarGlassApi } from "@/config";

export type PermType = {
  users: string[];
  perms: {
    email: string;
    projects: boolean;
    project: string[];
    note: boolean;
  }[];
};

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

export type TeamAdminProjectsData = {
  uuid: string;
  name: string;
  avatar: string;
  deleted: boolean;
  finished: boolean;
};

export type TeamAdminData = {
  uuid: string;
  created: Date;
  name: string;
  avatar: string;
  perms: any;
  owner: {
    email: string;
    avatar: string;
  };
  projects: TeamAdminProjectsData[];
  users: {
    email: string;
    avatar: string;
    _count: {
      teamMembers: number;
    };
  }[];
};

export type TeamNav = {
  name: string;
  avatar: string;
};

export type TeamNavWProject = {
  name: string;
  avatar: string;
  project: {
    name: string;
    avatar: string;
  };
};

export type TeamPage = {
  perms: any;
  name: string;
  avatar: string;
  created: Date;
  description: string;
  _count: {
    tasks: number;
    sub_tasks: number;
  };
  owner: {
    avatar: string;
    email: string;
  };
  users: {
    avatar: string;
    email: string;
  }[];
  projects: {
    tasks: {
      uuid: string;
      title: string;
      color: string;
      _count: {
        sub_tasks: number;
      };
      finished: boolean;
      asUsers: {
        email: string;
        avatar: string;
      }[];
      checked_users: {
        email: string;
        avatar: string;
      }[];
    }[];

    uuid: string;
    name: string;
    avatar: string;
    created: Date;
    finished: boolean;
  }[];
  teamNote: {
    id: number;
    text: string;
  }[];
};

/**
 * Fetches all teams associated with the authenticated user.
 *
 * @param {string} jwt - The JWT token for authentication.
 * @returns {Promise<{ data: TeamType[] }>} - Returns an object containing an array of teams.
 */
export async function getTeams({
  jwt,
}: {
  jwt: string;
}): Promise<{ data: TeamType[] }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { data: [] }; // If JWT is invalid, return an empty array

  // Fetch teams from the database where the user is a member
  const data = await DB.teams.findMany({
    where: {
      users: {
        every: {
          id: vJwt.id, // Ensure the user is part of the team
        },
      },
    },
    select: {
      uuid: true, // Select team UUID
      created: true, // Select team creation date
      name: true, // Select team name
      avatar: true, // Select team avatar
      perms: true, // Select team permissions
      owner: {
        select: {
          email: true, // Select owner's email
          avatar: true, // Select owner's avatar
        },
      },
      projects: {
        select: {
          uuid: true, // Select project UUID
          name: true, // Select project name
          avatar: true, // Select project avatar
        },
        where: {
          deleted: false, // Exclude deleted projects
          finished: false, // Exclude finished projects
        },
      },
      users: {
        select: {
          _count: {
            select: {
              teamMembers: true, // Count of team members
            },
          },
        },
      },
    },
  });

  // Return the fetched teams
  return { data: data };
}

/**
 * Creates a new team with the authenticated user as the owner.
 *
 * @param {string} jwt - The JWT token for authentication.
 * @param {string} name - The name of the team.
 * @param {string} avatar - The avatar URL of the team.
 * @returns {Promise<{ status: 200 | 201 }>} - Returns a status indicating success (200) or failure (201).
 */
export async function createTeam({
  jwt,
  name,
  avatar,
}: {
  jwt: string;
  name: string;
  avatar: string;
}): Promise<{ status: 200 | 201 }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Create a new team in the database
  const create = await DB.teams.create({
    data: {
      name: name, // Set team name
      avatar: avatar, // Set team avatar
      owner_id: vJwt.id, // Set the authenticated user as the owner
      perms: {}, // Initialize permissions as an empty object
      users: {
        connect: {
          id: vJwt.id, // Connect the authenticated user to the team
        },
      },
    },
  });

  // Return success status
  return { status: 200 };
}
/**
 * Fetches all team with information for admin.
 *
 * @param {string} jwt - The JWT token for authentication.
 * @param {string} uuid - The uuid of team.
 * @returns {Promise<{ status: 201 } | { status: 200; data: TeamAdminData }>} - Returns an object containing team information.
 */
export async function getTeam({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<{ status: 201 } | { status: 200; data: TeamAdminData }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Fetch user data
  const user = await DB.users.findUnique({ where: { id: vJwt.id } });
  if (!user) return { status: 201 }; // If user is not found, return failure status

  // Find team with uuid
  const team = await DB.teams.findUnique({
    where: { uuid: uuid, users: { some: { id: user.id } } },
    include: {
      projects: {
        select: {
          uuid: true,
          name: true,
          avatar: true,
          deleted: true,
          finished: true,
        },
      },
      owner: {
        select: {
          email: true,
          avatar: true,
        },
      },
      users: {
        select: {
          email: true,
          avatar: true,
          _count: {
            select: {
              teamMembers: true,
            },
          },
        },
      },
    },
  });

  if (!team) return { status: 201 }; // If team is not found, return failure status

  // Check if the user is the owner
  if (team.owner_id === vJwt.id) {
    return { status: 200, data: team }; // If user is the owner, return team data
  }

  // Check permissions
  if (!CheckPermBE(team.perms, user.email, uuid)) return { status: 201 }; // If user doesn't have permissions, return failure status

  // If all checks pass, return the team data
  return { status: 200, data: team };
}

/**
 * Fetches basic team navigation information for a user.
 *
 * @param {string} jwt - The JWT token for authentication.
 * @param {string} uuid - The uuid of team.
 * @returns {Promise<{ status: 201 } | { status: 200; data: TeamNav }>} - Returns an object containing basic team navigation information.
 */
export async function getTeamNav({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<{ status: 201 } | { status: 200; data: TeamNav }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Find team with uuid
  const team = await DB.teams.findUnique({
    where: { uuid: uuid },
    select: {
      name: true,
      avatar: true,
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  // Check the team is defined
  if (!team) return { status: 201 }; // If team is not found, return failure status

  // Check user is member of team
  if (!team.users.find((g) => g.id === vJwt.id)) return { status: 201 }; // If user is not a member, return failure status

  return {
    status: 200,
    data: {
      name: team.name,
      avatar: team.avatar,
    },
  };
}

/**
 * Fetches team navigation information including project details for a user.
 *
 * @param {string} jwt - The JWT token for authentication.
 * @param {string} uuid - The uuid of project.
 * @returns {Promise<{ status: 201 } | { status: 200; data: TeamNavWProject }>} - Returns an object containing team and project navigation information.
 */
export async function getTeamNavWProject({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<{ status: 201 } | { status: 200; data: TeamNavWProject }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Fetch user data
  const user = await DB.users.findUnique({ where: { id: vJwt.id } });
  if (!user) return { status: 201 }; // If user is not found, return failure status

  // Find project with uuid
  const project = await DB.projects.findUnique({
    where: { uuid: uuid, team: { users: { some: { id: user.id } } } },
    select: {
      name: true,
      avatar: true,
      team: {
        select: {
          name: true,
          avatar: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // Check the project is defined
  if (!project) return { status: 201 }; // If project is not found, return failure status

  return {
    status: 200,
    data: {
      name: project.team.name,
      avatar: project.team.avatar,
      project: {
        name: project.name,
        avatar: project.avatar,
      },
    },
  };
}

/**
 * Fetches team page data for a given UUID after verifying the JWT token.
 *
 * @param {jwt: string;uuid: string;} params - The input parameters containing JWT and UUID.
 * @returns {Promise<{ status: 201 } | { status: 200; data: TeamPage }>} - Returns a promise resolving to the team page data or a failure status.
 */
export async function getTeamPage({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<{ status: 201 } | { status: 200; data: TeamPage }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Fetch user data
  const user = await DB.users.findUnique({ where: { id: vJwt.id } });
  if (!user) return { status: 201 }; // If user is not found, return failure status

  // Fetch team data from the database
  const team = await DB.teams.findUnique({
    where: { uuid, users: { some: { id: user.id } } },
    select: {
      avatar: true,
      created: true,
      name: true,
      perms: true,
      description: true,
      _count: {
        select: {
          tasks: true,
          sub_tasks: true,
        },
      },
      users: {
        select: {
          email: true,
          avatar: true,
        },
      },
      owner: {
        select: {
          email: true,
          avatar: true,
        },
      },
      projects: {
        where: {
          deleted: false,
        },
        select: {
          uuid: true,
          name: true,
          avatar: true,
          finished: true,
          created: true,
          tasks: {
            select: {
              uuid: true,
              color: true,
              finished: true,
              title: true,
              asUsers: {
                select: {
                  avatar: true,
                  email: true,
                },
              },
              checked_users: {
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
      },
      teamNote: {
        select: {
          id: true,
          text: true,
        },
      },
    },
  });

  // If team is not found, return failure status
  if (!team) return { status: 201 };

  // Return success status with team data
  return { status: 200, data: team };
}

export async function createProject({
  teamId,
  jwt,
  data,
}: {
  teamId: string;
  jwt: string;
  data: { name: string; avatar: string; users: string[] };
}): Promise<{ status: 201 | 200 }> {
  // Verify the JWT token to authenticate the user
  const vJwt = await verifyJwt(jwt);
  if (!vJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Fetch user data
  const user = await DB.users.findUnique({ where: { id: vJwt.id } });
  if (!user) return { status: 201 }; // If user is not found, return failure status

  const team = await DB.teams.findUnique({
    where: {
      uuid: teamId,
      users: {
        some: {
          email: user.email,
        },
      },
    },
  });
  if (!team) return { status: 201 };

  if (
    team.owner_id !== user.id &&
    !CheckPerm(team.perms as PermType, user.email, "")
  )
    return { status: 201 };

  const res = await DB.projects.create({
    data: {
      name: data.name,
      avatar:
        data.avatar.length !== 0 ? data.avatar : avatarGlassApi(data.avatar),
      team_id: team.id,
      asUsers: {
        connect: data.users.map((email) => ({ email })),
      },
    },
  });

  if (!res) return { status: 201 };

  return { status: 200 };
}
