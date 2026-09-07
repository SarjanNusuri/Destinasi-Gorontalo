<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BudayaRequest;
use App\Models\Budaya;
use Illuminate\Support\Str;

class BudayaController extends Controller
{
    public function index()
    {
        $budaya = Budaya::orderBy('id')->get();

        return inertia('Admin/Budaya/Index', ['budaya' => $budaya]);
    }

    public function create()
    {
        return inertia('Admin/Budaya/Create');
    }

    public function store(BudayaRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'budaya_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('budaya', $filename, 'assets');
            $data['image'] = '/assets/images/budaya/' . $filename;
        }
        unset($data['image_file']);

        Budaya::create($data);

        return redirect()->route('admin.budaya.index')->with('success', 'Budaya berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $budaya = Budaya::findOrFail($id);

        return inertia('Admin/Budaya/Edit', ['budaya' => $budaya]);
    }

    public function update(BudayaRequest $request, $id)
    {
        $budaya = Budaya::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'budaya_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('budaya', $filename, 'assets');
            $data['image'] = '/assets/images/budaya/' . $filename;
        }
        unset($data['image_file']);

        $budaya->update($data);

        return redirect()->route('admin.budaya.index')->with('success', 'Budaya berhasil diupdate.');
    }

    public function destroy($id)
    {
        $budaya = Budaya::findOrFail($id);
        $budaya->delete();

        return redirect()->route('admin.budaya.index')->with('success', 'Budaya berhasil dihapus.');
    }
}
