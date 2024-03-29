﻿//	---------------------------------------------------------------------------
//	jWebSocket - TimeoutOutputStreamNIOWriter
//	Copyright (c) 2011 Alexander Schulze, Innotrade GmbH
//	---------------------------------------------------------------------------
//	This program is free software; you can redistribute it and/or modify it
//	under the terms of the GNU Lesser General Public License as published by the
//	Free Software Foundation; either version 3 of the License, or (at your
//	option) any later version.
//	This program is distributed in the hope that it will be useful, but WITHOUT
//	ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
//	FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
//	more details.
//	You should have received a copy of the GNU Lesser General Public License along
//	with this program; if not, see <http://www.gnu.org/licenses/lgpl.html>.
//	---------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ClientLibrary.org.jwebsocket.client.kit
{
    /// <summary>
    /// Author Rolando Betancourt Toucet
    /// </summary>
    public enum WebSocketExceptionType
    {
        UNDEFINED = -1,

        UNKNOWN_HOST = 1,

        UNABLE_TO_CONNECT = 2,

        UNABLE_TO_CONNECT_SSL = 3,

        PROTOCOL_NOT_SUPPORTED = 4,

        HOST_DOWN = 5,

        HOST_NOT_REACHABLE = 6,

        OPENING_HANDSHAKE_FAILED = 7,

        CLOSING_HANDSHAKE_FAILED = 8,

        INVALID_FRAME_TYPE = 9
    }
}
   

