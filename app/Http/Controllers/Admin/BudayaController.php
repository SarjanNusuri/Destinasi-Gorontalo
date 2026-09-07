<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BudayaController extends Controller
{
    public function index()
    {
        return inertia('Admin/Budaya/Index');
    }

    public function create()
    {
        return inertia('Admin/Budaya/Create');
    }

    public function edit($id)
    {
        return inertia('Admin/Budaya/Edit', ['id' => $id]);
    }
}
