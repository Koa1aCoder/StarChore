// Mock API client for StarChore
// This is a placeholder that simulates a database API

interface Chore {
  id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "one-time";
  star_value: number;
  assigned_to: string;
  assigned_to_name: string;
  created_date: string;
}

interface Kid {
  id: string;
  name: string;
  email?: string;
}

interface ChoreLog {
  id: string;
  chore_id: string;
  chore_title: string;
  kid_id: string;
  kid_name: string;
  star_value: number;
  status: "pending" | "approved" | "rejected";
  started_date: string;
  completed_date: string;
  created_date: string;
}

interface Notification {
  id: string;
  message: string;
  kid_name: string;
  chore_title: string;
  is_read: boolean;
  created_date: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number; // cost in stars
  created_date: string;
}

interface RewardRedemption {
  id: string;
  reward_id: string;
  reward_title: string;
  kid_id: string;
  kid_name: string;
  redeemed_date: string;
  cost: number;
}

// Mock data storage
let chores: Chore[] = [];
let kids: Kid[] = [];
let choreLogs: ChoreLog[] = [];
let notifications: Notification[] = [];
let rewards: Reward[] = [];
let redemptions: RewardRedemption[] = [];

const base44 = {
  entities: {
    Chore: {
      async list(): Promise<Chore[]> {
        return chores;
      },
      async create(data: Omit<Chore, "id" | "created_date">): Promise<Chore> {
        const chore: Chore = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        chores.push(chore);
        return chore;
      },
      async update(id: string, data: Partial<Chore>): Promise<Chore> {
        const index = chores.findIndex((c) => c.id === id);
        if (index === -1) throw new Error("Chore not found");
        chores[index] = { ...chores[index], ...data };
        return chores[index];
      },
      async delete(id: string): Promise<void> {
        chores = chores.filter((c) => c.id !== id);
      },
    },

    Kid: {
      async list(): Promise<Kid[]> {
        // seed a demo kid so UI features like rewards can be tried immediately
        if (kids.length === 0) {
          kids = [{ id: Date.now().toString() + "-k1", name: "Demo Kid" }];
        }
        return kids;
      },
      async create(data: Omit<Kid, "id">): Promise<Kid> {
        const kid: Kid = {
          ...data,
          id: Date.now().toString(),
        };
        kids.push(kid);
        return kid;
      },
      async update(id: string, data: Partial<Kid>): Promise<Kid> {
        const index = kids.findIndex((k) => k.id === id);
        if (index === -1) throw new Error("Kid not found");
        kids[index] = { ...kids[index], ...data };
        return kids[index];
      },
      async delete(id: string): Promise<void> {
        kids = kids.filter((k) => k.id !== id);
      },
    },

    ChoreLog: {
      async list(sort?: string, limit?: number): Promise<ChoreLog[]> {
        let result = [...choreLogs];
        if (limit) result = result.slice(0, limit);
        if (sort === "-created_date") {
          result.sort((a, b) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime()
          );
        }
        return result;
      },
      async create(data: Omit<ChoreLog, "id" | "created_date">): Promise<ChoreLog> {
        const log: ChoreLog = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        choreLogs.push(log);
        return log;
      },
      async update(id: string, data: Partial<ChoreLog>): Promise<ChoreLog> {
        const index = choreLogs.findIndex((l) => l.id === id);
        if (index === -1) throw new Error("ChoreLog not found");
        choreLogs[index] = { ...choreLogs[index], ...data };
        return choreLogs[index];
      },
      async delete(id: string): Promise<void> {
        choreLogs = choreLogs.filter((l) => l.id !== id);
      },
    },

    Notification: {
      async list(): Promise<Notification[]> {
        return notifications;
      },
      async create(data: Omit<Notification, "id" | "created_date">): Promise<Notification> {
        const notification: Notification = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        notifications.push(notification);
        return notification;
      },
      async update(id: string, data: Partial<Notification>): Promise<Notification> {
        const index = notifications.findIndex((n) => n.id === id);
        if (index === -1) throw new Error("Notification not found");
        notifications[index] = { ...notifications[index], ...data };
        return notifications[index];
      },
      async delete(id: string): Promise<void> {
        notifications = notifications.filter((n) => n.id !== id);
      },
    },
    Reward: {
      async list(): Promise<Reward[]> {
        // seed defaults if empty
        if (rewards.length === 0) {
          rewards = [
            // Experience/Privilege Rewards
            { id: "reward-1", title: "Choose Dinner", description: "Pick what the family eats tonight", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-2", title: "Pick the Dessert", description: "Choose what dessert the family has", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-3", title: "Choose the Music", description: "Pick the music playing at home", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-4", title: "Choose the Family Game", description: "Pick what game the family plays", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-5", title: "Control the TV Remote", description: "You control what everyone watches", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-6", title: "Choose the Family Activity", description: "Pick what the family does together", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-7", title: "Choose the Playlist", description: "Control the music playlist", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-8", title: "Sit in the Front Seat", description: "Ride in the front seat of the car", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-9", title: "One-on-One Time", description: "Special time with a parent of your choice", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-10", title: "Extra Bedtime Story", description: "Get an extra bedtime story", cost: 15, created_date: new Date().toISOString() },

            // Skip/Pass Rewards
            { id: "reward-11", title: "Skip One Chore", description: "Skip one assigned chore without penalty", cost: 40, created_date: new Date().toISOString() },
            { id: "reward-12", title: "No-Chores Day Pass", description: "Get a full day free from all chores", cost: 50, created_date: new Date().toISOString() },

            // Small Physical Items
            { id: "reward-13", title: "Dollar Store Item", description: "Pick any item from the dollar store", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-14", title: "Sticker Pack", description: "Get a cool sticker pack", cost: 10, created_date: new Date().toISOString() },
            { id: "reward-15", title: "Mini Toy", description: "Pick a mini toy from the collection", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-16", title: "Fidget Toy", description: "Get a fidget toy of your choice", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-17", title: "Craft Supplies", description: "Pick out craft supplies you want", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-18", title: "Coloring Book", description: "Get a new coloring book", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-19", title: "New Markers", description: "Get a set of new markers", cost: 12, created_date: new Date().toISOString() },
            { id: "reward-20", title: "Lip Gloss or Chapstick", description: "Pick your favorite lip gloss or chapstick", cost: 15, created_date: new Date().toISOString() },

            // Activity Rewards
            { id: "reward-21", title: "Park Trip", description: "Special trip to your favorite park", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-22", title: "Bike Ride", description: "Go on a bike ride with the family", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-23", title: "Baking Time", description: "Bake treats with a parent", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-24", title: "Library Trip", description: "Go to the library and pick books", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-25", title: "Picnic", description: "Have a family picnic", cost: 35, created_date: new Date().toISOString() },
            { id: "reward-26", title: "Nature Walk", description: "Go on a nature walk", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-27", title: "Dance Party", description: "Have a family dance party", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-28", title: "Drive-Thru Treat", description: "Get a treat from your favorite drive-thru", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-29", title: "Visit a Friend", description: "Have a friend come over or visit them", cost: 30, created_date: new Date().toISOString() },

            // Creative/Fun Rewards
            { id: "reward-30", title: "Mystery Prize Box", description: "Open a mystery box with a surprise inside", cost: 45, created_date: new Date().toISOString() },
            { id: "reward-31", title: "Treasure Hunt", description: "Parents create a treasure hunt for you", cost: 40, created_date: new Date().toISOString() },
            { id: "reward-32", title: "Choose a Craft Project", description: "Pick a craft project to make with parents", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-33", title: "Make Slime", description: "Make slime with fun colors and textures", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-34", title: "Paint Nails", description: "Get your nails painted", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-35", title: "Temporary Tattoos", description: "Get temporary tattoos of your choice", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-36", title: "DIY Bracelet Kit", description: "Get a DIY bracelet-making kit", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-37", title: "Decorate Cookies", description: "Decorate and eat cookies with the family", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-38", title: "Build a Fort", description: "Build a fort with blankets and pillows", cost: 35, created_date: new Date().toISOString() },
            { id: "reward-39", title: "Make a Blanket Nest", description: "Make a cozy blanket nest", cost: 30, created_date: new Date().toISOString() },

            // Special/Seasonal Rewards
            { id: "reward-40", title: "Birthday Bonus Points", description: "Get bonus points on your birthday", cost: 100, created_date: new Date().toISOString() },
            { id: "reward-41", title: "Holiday Surprise", description: "Get a special holiday surprise", cost: 80, created_date: new Date().toISOString() },
            { id: "reward-42", title: "Seasonal Treat", description: "Get a seasonal treat", cost: 60, created_date: new Date().toISOString() },
            { id: "reward-43", title: "Theme Park Trip", description: "Trip to an amusement or theme park", cost: 300, created_date: new Date().toISOString() },
            { id: "reward-44", title: "New Outfit", description: "Get a new outfit of your choice", cost: 150, created_date: new Date().toISOString() },
            { id: "reward-45", title: "Room Makeover Item", description: "Pick an item to decorate your room", cost: 120, created_date: new Date().toISOString() },
            { id: "reward-46", title: "Special Event Tickets", description: "Tickets to a special event you want to see", cost: 200, created_date: new Date().toISOString() },

            // Original Rewards (kept for reference)
            { id: "reward-47", title: "$5 Toys R Us gift card", description: "$5 Toys R Us gift card", cost: 500, created_date: new Date().toISOString() },
            { id: "reward-48", title: "$5 Five Below Gift Card", description: "$5 Five Below Gift Card", cost: 500, created_date: new Date().toISOString() },
            { id: "reward-49", title: "Walmart Gift Card", description: "Walmart gift card", cost: 500, created_date: new Date().toISOString() },
            { id: "reward-50", title: "$5 Target Gift Card", description: "$5 Target Gift Card", cost: 500, created_date: new Date().toISOString() },
            { id: "reward-51", title: "$5 Amazon Gift Card", description: "$5 Amazon Gift Card", cost: 500, created_date: new Date().toISOString() },
            { id: "reward-52", title: "New Book", description: "Pick a new book from the bookstore", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-53", title: "Sleepover with a Friend", description: "Have a friend sleep over this weekend", cost: 55, created_date: new Date().toISOString() },
            { id: "reward-54", title: "Movie Night Pick", description: "You choose the family movie this weekend", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-55", title: "Extra Screen Time", description: "30 minutes of extra tablet or TV time", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-56", title: "Ice Cream Treat", description: "Pick any ice cream flavor from the store", cost: 20, created_date: new Date().toISOString() },

            // Special Experiences & Adventures
            { id: "reward-55", title: "One-on-One Day", description: "A special day with a parent or grandparent", cost: 50, created_date: new Date().toISOString() },
            { id: "reward-56", title: "Weekend Activity Choice", description: "Choosing the family's weekend activity", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-57", title: "Amusement Park Trip", description: "Trip to an amusement or water park", cost: 250, created_date: new Date().toISOString() },
            { id: "reward-58", title: "Zoo or Aquarium Visit", description: "Visiting a zoo, aquarium, or science museum", cost: 100, created_date: new Date().toISOString() },
            { id: "reward-59", title: "Professional Sports Game", description: "Going to a professional sports game", cost: 200, created_date: new Date().toISOString() },
            { id: "reward-60", title: "Camping Adventure", description: "A camping adventure with the family", cost: 150, created_date: new Date().toISOString() },
            { id: "reward-61", title: "Surprise Road Trip", description: "A surprise road trip", cost: 140, created_date: new Date().toISOString() },
            { id: "reward-62", title: "Trampoline Park", description: "Visit an indoor trampoline park", cost: 80, created_date: new Date().toISOString() },
            { id: "reward-63", title: "Movie Theater Outing", description: "Movie theater outing with friends", cost: 60, created_date: new Date().toISOString() },
            { id: "reward-64", title: "Cooking Head Chef Day", description: "Be the head chef for a cooking or baking day", cost: 70, created_date: new Date().toISOString() },

            // Privileges Kids Love
            { id: "reward-65", title: "Stay Up Late", description: "Stay up an hour later on a chosen night", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-66", title: "Pick Dinner Night", description: "Picking dinner for the family", cost: 20, created_date: new Date().toISOString() },
            { id: "reward-67", title: "Boss of the Day", description: "Being 'boss of the day' with special privileges", cost: 40, created_date: new Date().toISOString() },
            { id: "reward-68", title: "Car Music Control", description: "Choosing the music during car rides", cost: 15, created_date: new Date().toISOString() },
            { id: "reward-69", title: "Friend Sleepover", description: "Having a friend sleep over", cost: 50, created_date: new Date().toISOString() },
            { id: "reward-70", title: "Room Makeover Day", description: "A room makeover day", cost: 110, created_date: new Date().toISOString() },
            { id: "reward-71", title: "Extra Screen Time", description: "Extra screen time", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-72", title: "Yes Day", description: "A 'yes day' with reasonable boundaries", cost: 85, created_date: new Date().toISOString() },
            { id: "reward-73", title: "Vacation Activity Choice", description: "Choosing the next family vacation activity", cost: 45, created_date: new Date().toISOString() },
            { id: "reward-74", title: "Special Seat", description: "Special seat in the car or at the dinner table", cost: 25, created_date: new Date().toISOString() },

            // Skills and Hobby Rewards
            { id: "reward-75", title: "Art Lessons/Supplies", description: "Art lessons or supplies for a favorite hobby", cost: 110, created_date: new Date().toISOString() },
            { id: "reward-76", title: "Music Lessons", description: "Music lessons for an instrument they've wanted", cost: 130, created_date: new Date().toISOString() },
            { id: "reward-77", title: "Sports Camp", description: "Sports camp or specialized coaching", cost: 160, created_date: new Date().toISOString() },
            { id: "reward-78", title: "Photography Kit", description: "A beginner photography kit", cost: 110, created_date: new Date().toISOString() },
            { id: "reward-79", title: "STEM Kit", description: "A coding, robotics, or science kit", cost: 130, created_date: new Date().toISOString() },
            { id: "reward-80", title: "Gardening Kit", description: "Gardening supplies and their own garden space", cost: 90, created_date: new Date().toISOString() },
            { id: "reward-81", title: "Subscription Box", description: "A subscription box related to their interests", cost: 100, created_date: new Date().toISOString() },

            // Keepsakes They'll Treasure
            { id: "reward-82", title: "Personalized Trophy", description: "Personalized trophy or plaque for achievement", cost: 65, created_date: new Date().toISOString() },
            { id: "reward-83", title: "Framed Special Photo", description: "A framed photo of a special day", cost: 45, created_date: new Date().toISOString() },
            { id: "reward-84", title: "Memory Scrapbook", description: "A memory scrapbook of accomplishments", cost: 55, created_date: new Date().toISOString() },
            { id: "reward-85", title: "Personalized Book", description: "A personalized book featuring their name", cost: 75, created_date: new Date().toISOString() },
            { id: "reward-86", title: "Letter from Parents", description: "Letter from parents describing what they're proud of", cost: 35, created_date: new Date().toISOString() },
            { id: "reward-87", title: "Special Jewelry", description: "Special piece of jewelry or watch (older kids)", cost: 160, created_date: new Date().toISOString() },
            { id: "reward-88", title: "Hall of Fame Wall", description: "Hall of fame wall displaying milestones", cost: 110, created_date: new Date().toISOString() },

            // Social Rewards
            { id: "reward-89", title: "Themed Party", description: "Hosting a themed party with friends", cost: 140, created_date: new Date().toISOString() },
            { id: "reward-90", title: "Friend Date", description: "Friend date (ice cream, arcade, mini golf)", cost: 45, created_date: new Date().toISOString() },
            { id: "reward-91", title: "Backyard Campout", description: "Backyard campout with friends", cost: 65, created_date: new Date().toISOString() },
            { id: "reward-92", title: "Game Night Host", description: "Game night where they choose all games", cost: 35, created_date: new Date().toISOString() },
            { id: "reward-93", title: "Celebration Dinner", description: "Special celebration dinner in their honor", cost: 55, created_date: new Date().toISOString() },

            // Big "Core Memory" Rewards
            { id: "reward-94", title: "First Concert", description: "Attending their first concert", cost: 280, created_date: new Date().toISOString() },
            { id: "reward-95", title: "Learn Special Skill", description: "Learning a special skill with a parent", cost: 160, created_date: new Date().toISOString() },
            { id: "reward-96", title: "Weekend Getaway", description: "A weekend getaway with family", cost: 320, created_date: new Date().toISOString() },
            { id: "reward-97", title: "Airplane Trip", description: "Flying on an airplane for a fun trip", cost: 100000, created_date: new Date().toISOString() },
            { id: "reward-98", title: "Meet Favorite Person", description: "Meeting a favorite athlete, author, or performer", cost: 380, created_date: new Date().toISOString() },
            { id: "reward-99", title: "Create Lasting Project", description: "Creating something lasting like treehouse or garden", cost: 220, created_date: new Date().toISOString() },

            // Age-Specific Favorites
            { id: "reward-100", title: "Treasure Hunt", description: "Treasure hunt adventure", cost: 35, created_date: new Date().toISOString() },
            { id: "reward-101", title: "Dress-Up Experience", description: "Dress-up experiences and play", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-102", title: "Zoo Adventure", description: "Zoo visit adventure", cost: 85, created_date: new Date().toISOString() },
            { id: "reward-103", title: "Ice Cream Date", description: "Ice cream date with parent", cost: 25, created_date: new Date().toISOString() },
            { id: "reward-104", title: "Parent's Helper Day", description: "Being a parent's helper for the day", cost: 30, created_date: new Date().toISOString() },
            { id: "reward-105", title: "Adventure Park", description: "Adventure park visit", cost: 110, created_date: new Date().toISOString() },
            { id: "reward-106", title: "Building Project", description: "Special building project with parent", cost: 110, created_date: new Date().toISOString() },
            { id: "reward-107", title: "Sports Event Outing", description: "Going to a sports event", cost: 90, created_date: new Date().toISOString() },
            { id: "reward-108", title: "Hobby Gear", description: "New gear or supplies for favorite hobby", cost: 100, created_date: new Date().toISOString() },
            { id: "reward-109", title: "Decision-Making Privilege", description: "More independence and decision-making privileges", cost: 50, created_date: new Date().toISOString() },
            { id: "reward-110", title: "Shopping Budget", description: "Shopping budget for something they choose", cost: 170, created_date: new Date().toISOString() },
            { id: "reward-111", title: "Concert or Live Event", description: "Concerts and live events", cost: 220, created_date: new Date().toISOString() },
            { id: "reward-112", title: "Escape Room", description: "Escape room experience", cost: 110, created_date: new Date().toISOString() },
            { id: "reward-113", title: "Friends Experience", description: "Special experience with friends", cost: 65, created_date: new Date().toISOString() },
          ];
        }
        return rewards;
      },
      async create(data: Omit<Reward, "id" | "created_date">): Promise<Reward> {
        const r: Reward = { ...data, id: Date.now().toString(), created_date: new Date().toISOString() };
        rewards.push(r);
        return r;
      },
      async update(id: string, data: Partial<Reward>): Promise<Reward> {
        const index = rewards.findIndex((r) => r.id === id);
        if (index === -1) throw new Error("Reward not found");
        rewards[index] = { ...rewards[index], ...data };
        return rewards[index];
      },
      async delete(id: string): Promise<void> {
        rewards = rewards.filter((r) => r.id !== id);
      },
    },
    RewardRedemption: {
      async list(): Promise<RewardRedemption[]> {
        return redemptions.sort((a, b) => 
          new Date(b.redeemed_date).getTime() - new Date(a.redeemed_date).getTime()
        );
      },
      async create(data: Omit<RewardRedemption, "id" | "redeemed_date">): Promise<RewardRedemption> {
        const redemption: RewardRedemption = {
          ...data,
          id: Date.now().toString(),
          redeemed_date: new Date().toISOString(),
        };
        redemptions.push(redemption);
        return redemption;
      },
      async delete(id: string): Promise<void> {
        redemptions = redemptions.filter((r) => r.id !== id);
      },
    },
  },
};

export { base44 };
export type { Chore, Kid, ChoreLog, Notification, Reward, RewardRedemption };
