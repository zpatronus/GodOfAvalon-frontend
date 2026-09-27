// Copyright (C) 2022 Zijun Yang <zijun.yang@outlook.com>
// 
// This file is part of God of Avalon Frontend.
// 
// God of Avalon Frontend is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// God of Avalon Frontend is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with God of Avalon Frontend.  If not, see <http://www.gnu.org/licenses/>.

import { createRouter, createWebHistory } from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '../views/HomeView.vue';
import RoomEntryView from '../views/RoomEntryView.vue';
import WaitingRoomView from '../views/WaitingRoomView.vue';
import InRoomView from '../views/InRoomView.vue';

const routes = [
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('../views/GalleryView.vue'),
    meta: { title: '画廊 · God of Avalon' }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/createroom',
    name: 'createroom',
    redirect: to => ({ path: '/room', query: to.query }),
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/joinroom',
    name: 'joinroom',
    redirect: to => ({ path: '/room', query: to.query }),
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/room',
    name: 'room',
    component: RoomEntryView,
    meta: { title: 'God of Avalon' }
  },
  {
    path: '/waitingroom',
    name: 'waitingroom',
    component: WaitingRoomView,
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/inroom',
    name: 'inroom',
    component: InRoomView,
    meta: {
      title: 'God of Avalon'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
