<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('make_id')->constrained()->restrictOnDelete();
            $table->foreignId('car_model_id')->constrained('car_models')->restrictOnDelete();
            $table->unsignedSmallInteger('year');
            $table->unsignedInteger('price');
            $table->unsignedInteger('mileage')->default(0);
            $table->string('fuel_type');
            $table->string('body_type');
            $table->string('transmission');
            $table->string('condition');
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country')->default('US');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
