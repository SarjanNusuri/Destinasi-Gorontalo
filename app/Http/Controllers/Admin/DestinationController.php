<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index()
    {
        return inertia('Admin/Destinations/Index');
    }

    public function create()
    {
        return inertia('Admin/Destinations/Create');
    }

    public function edit($id)
    {
        return inertia('Admin/Destinations/Edit', ['id' => $id]);
    }
}
